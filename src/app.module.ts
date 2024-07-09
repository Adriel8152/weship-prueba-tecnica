import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShipmentStatusCronModule } from './shipment-satus-cron/shipment-statust-cron.module';
import { TrackingHistoryModule } from './tracking-history/tracking-history.module';

@Module({
  imports: [
    ShipmentModule,
    ScheduleModule.forRoot(),
    ShipmentStatusCronModule,
    TrackingHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
