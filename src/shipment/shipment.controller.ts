import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateProductDto } from './dto/create-shipment.dto';

@Controller('envios')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}
  @Post('/')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.shipmentService.createShipment(createProductDto);
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    return this.shipmentService.getOne(id);
  }

  @Get('/')
  async getAll() {
    return this.shipmentService.getAll();
  }
}
