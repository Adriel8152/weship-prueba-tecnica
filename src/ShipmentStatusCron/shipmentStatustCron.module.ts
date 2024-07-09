import { Module } from '@nestjs/common';
import { ShipmentStatusCronService } from './shipmentStatusCron.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { ShipmentService } from 'src/shipment/shipment.service';

@Module({
  controllers: [],
  providers: [ShipmentStatusCronService, PrismaService, ShipmentService],
})
export class ShipmentStatusCronModule {}
