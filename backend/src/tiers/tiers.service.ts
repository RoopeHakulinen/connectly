import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TiersService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.tier.findMany({
      where: {
        userId,
      },
    });
  }
}
