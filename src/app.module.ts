import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [ShipmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
