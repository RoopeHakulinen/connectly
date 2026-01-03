import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TargetsService {
  constructor(private prisma: PrismaService) {}

  create(createTargetDto: CreateTargetDto, userId: number) {
    return this.prisma.target.create({
      data: {
        name: createTargetDto.name,
        notes: createTargetDto.notes,
        type: createTargetDto.type,
        tier: {
          connect: {
            id: createTargetDto.tierId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        notificationEnabled: createTargetDto.notificationEnabled,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.target.findMany({
      where: {
        userId,
      },
      include: {
        tier: true,
        activities: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.target.findUnique({
      where: {
        id,
      },
      include: {
        tier: true,
        activities: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });
  }

  update(id: number, updateTargetDto: UpdateTargetDto) {
    return this.prisma.target.update({
      where: {
        id,
      },
      data: updateTargetDto,
    });
  }

  remove(id: number) {
    return this.prisma.target.delete({
      where: {
        id,
      },
    });
  }

  async createActivity(
    targetId: number,
    userId: number,
    createActivityDto: CreateActivityDto,
  ) {
    const target = await this.prisma.target.findFirst({
      where: {
        id: targetId,
        userId,
      },
    });

    if (!target) {
      throw new NotFoundException('Target not found');
    }

    return this.prisma.activity.create({
      data: {
        type: createActivityDto.type,
        timestamp: createActivityDto.timestamp
          ? new Date(createActivityDto.timestamp)
          : new Date(),
        target: {
          connect: {
            id: targetId,
          },
        },
      },
    });
  }
}
