import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackingHistoryService } from './tracking-history.service';

@Controller('historial')
export class TrackingHistoryController {
  constructor(
    private readonly trackingHistoryService: TrackingHistoryService,
  ) {}
  @Get('/')
  async getAll() {
    return this.trackingHistoryService.getAll();
  }
}
