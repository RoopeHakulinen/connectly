import { Injectable } from '@nestjs/common';
import { Tier } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';

@Injectable()
export class TiersService {
  constructor(private prisma: PrismaService) {}

  private getFrequencyInDays(interval: string): number {
    const freqMatch = interval.match(/FREQ=(\w+)/i);
    const intervalMatch = interval.match(/INTERVAL=(\d+)/i);

    const freq = freqMatch ? freqMatch[1].toUpperCase() : 'WEEKLY';
    const intervalNum = intervalMatch ? parseInt(intervalMatch[1], 10) : 1;

    const baseDays: Record<string, number> = {
      DAILY: 1,
      WEEKLY: 7,
      MONTHLY: 30,
      YEARLY: 365,
    };

    return (baseDays[freq] || 7) * intervalNum;
  }

  create(createTierDto: CreateTierDto, userId: number) {
    return this.prisma.tier.create({
      data: {
        name: createTierDto.name,
        interval: createTierDto.interval,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: number): Promise<Tier[]> {
    const tiers = await this.prisma.tier.findMany({
      where: {
        userId,
      },
    });

    return tiers.sort(
      (a, b) => this.getFrequencyInDays(a.interval) - this.getFrequencyInDays(b.interval),
    );
  }

  findOne(id: number, userId: number) {
    return this.prisma.tier.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  update(id: number, userId: number, updateTierDto: UpdateTierDto) {
    return this.prisma.tier.updateMany({
      where: {
        id,
        userId,
      },
      data: updateTierDto,
    }).then(() => this.findOne(id, userId));
  }

  remove(id: number, userId: number) {
    return this.prisma.tier.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
