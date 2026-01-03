import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { CommonIntervals } from '../common/tier-interval';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(email: string, name: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
      },
    });

    await this.prisma.tier.createMany({
      data: [
        {
          name: 'Close friends',
          userId: user.id,
          interval: CommonIntervals.MONTHLY.toString(),
        },
        {
          name: 'Friends',
          userId: user.id,
          interval: CommonIntervals.QUARTERLY.toString(),
        },
        {
          name: 'Acquaintances',
          userId: user.id,
          interval: CommonIntervals.SEMIANNUALLY.toString(),
        },
      ],
    });

    return user;
  }
}
