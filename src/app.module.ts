import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShipmentStatusCronModule } from './ShipmentStatusCron/shipmentStatustCron.module';

@Module({
  imports: [ShipmentModule, ScheduleModule.forRoot(), ShipmentStatusCronModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
