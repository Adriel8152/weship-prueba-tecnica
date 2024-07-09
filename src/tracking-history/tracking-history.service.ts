import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class TrackingHistoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.trackingHistory.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }
}
