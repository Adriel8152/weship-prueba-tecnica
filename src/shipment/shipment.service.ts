import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateProductDto } from './dto/create-shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(private prisma: PrismaService) {}

  async createShipment({
    trackingNumber,
    company,
    customerName,
    address,
    email,
    phone,
  }: CreateProductDto) {
    return await this.prisma.shipment.create({
      data: {
        trackingNumber,
        company,
        customerName,
        address,
        email,
        phone,
      },
    });
  }

  async getOne(id: string) {
    return this.prisma.shipment.findFirst({ where: { id: id } });
  }

  async getAll() {
    return this.prisma.shipment.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
