import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';

@Injectable()
export class TiersService {
  constructor(private prisma: PrismaService) {}

  create(createTierDto: CreateTierDto, userId: number) {
    return this.prisma.tier.create({
      data: {
        interval: createTierDto.interval,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.tier.findMany({
      where: {
        userId,
      },
    });
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
