import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

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
          userId: user.id,
          priority: 1,
        },
        {
          userId: user.id,
          priority: 2,
        },
        {
          userId: user.id,
          priority: 3,
        },
      ],
    });

    return user;
  }
}
