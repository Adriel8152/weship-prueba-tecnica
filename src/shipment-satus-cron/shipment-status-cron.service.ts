import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { PrismaService } from 'src/common/services/prisma.service';
import { ShipmentService } from 'src/shipment/shipment.service';

@Injectable()
export class ShipmentStatusCronService {
  constructor(
    private prisma: PrismaService,
    private shipmentService: ShipmentService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    const data = await this.shipmentService.getAll();
    data.forEach(async (item, _) => {
      if (!item.company) return;
      switch (item.company.toUpperCase()) {
        case 'DHL':
          {
            const status = await this.trackDHL(item.trackingNumber);
            if (status) this.saveTrackingStatus(item.id, status);
          }
          break;
        case 'ESTAFETA':
          {
            const status = await this.trackEstafeta(item.trackingNumber);
            if (status) this.saveTrackingStatus(item.id, status);
          }
          break;
        case 'FEDEX':
          {
            //not implemented
          }
          break;
        case '99MINUTOS':
          {
            const status = await this.track99Minutos(item.trackingNumber);
            if (status) this.saveTrackingStatus(item.id, status);
          }
          break;
      }
    });
  }

  async trackDHL(trackingNumber: string) {
    try {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      page.setUserAgent(ua);
      await page.goto('https://www.dhl.com/mx-es/home.html', {
        waitUntil: 'networkidle2',
      });
      // Remove overlay
      await page.waitForSelector('#onetrust-consent-sdk');
      await page.evaluate((overlaySelector) => {
        const overlay = document.querySelector(overlaySelector);
        if (overlay) {
          overlay.remove();
        }
      }, '#onetrust-consent-sdk');

      // Set form data
      const input = await page.$('#c-voc-marketing-stage-tracking--input');
      await input.type(trackingNumber);
      await input.press('Enter');

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      await page.waitForSelector('h2.c-tracking-result--status-copy-message');

      const status = await page.evaluate(() => {
        const element = document.querySelector(
          'h2.c-tracking-result--status-copy-message',
        );
        if (element) {
          return Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join('');
        }
        return null;
      });

      await browser.close();
      return status;
    } catch (error) {
      console.error('Error tracking package dhl:', error);
    }
  }

  async track99Minutos(trackingNumber: string) {
    try {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      page.setUserAgent(ua);
      await page.goto(
        `https://tracking.99minutos.com/search/${trackingNumber}`,
        {
          waitUntil: 'networkidle2',
        },
      );
      //get status
      await page.waitForSelector(
        'span[class="MuiTypography-root MuiTypography-body1 css-1ngbfnd"]',
      );
      const status = await page.evaluate(() => {
        const element = document.querySelector(
          'span[class="MuiTypography-root MuiTypography-body1 css-1ngbfnd"]',
        );
        if (element) {
          return element.textContent;
        }
        return null;
      });

      await browser.close();
      return status;
    } catch (error) {
      console.error('Error tracking package 99minutos:', error);
    }
  }

  async trackEstafeta(trackingNumber: string) {
    try {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      page.setUserAgent(ua);
      await page.goto('https://www.estafeta.com/rastrear-envio', {
        waitUntil: 'networkidle2',
      });
      //load first rame
      const frameElement = await page.$('iframe');
      const frame = await frameElement.contentFrame();
      await frame.type('#GuiaCodigo', trackingNumber);
      await (await frame.$('#btnRastrear')).click();
      await frame.waitForSelector(
        '[class="swal2-confirm HelveticaRoman btn btn-info swal2-styled"]',
      );
      const elementModal = await frame.$(
        '[class="swal2-confirm HelveticaRoman btn btn-info swal2-styled"]',
      );
      await elementModal.click();
      //load second Modal
      const frameElementProcess = await page.$('iframe');
      const frameProcess = await frameElementProcess.contentFrame();
      await frameProcess.waitForSelector('.fontColorCurrentProcess');
      const elementProcess = await frameProcess.$('.fontColorCurrentProcess');
      const status = await frameProcess.evaluate(
        (element) => element.textContent.trim(),
        elementProcess,
      );

      await browser.close();
      return status;
    } catch (error) {
      console.error('Error tracking package estafeta:', error);
    }
  }

  async saveTrackingStatus(id: string, status: string) {
    await this.prisma.shipment.update({ where: { id }, data: { status } });
    await this.prisma.trackingHistory.create({
      data: { status, shipmentId: id },
    });
  }
}
