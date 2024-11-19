import { Injectable } from '@nestjs/common';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
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
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.target.findMany({
      where: {
        userId,
      },
      include: {
        tier: {
          select: {
            priority: true,
          },
        },
        activities: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.target.findUnique({
      where: {
        id,
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
}
