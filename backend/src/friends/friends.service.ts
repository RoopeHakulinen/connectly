import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  create(createFriendDto: CreateFriendDto, userId: number) {
    return this.prisma.friend.create({
      data: {
        name: createFriendDto.name,
        notes: createFriendDto.notes,
        tier: {
          connect: {
            id: createFriendDto.tierId,
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
    return this.prisma.friend.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.friend.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return this.prisma.friend.update({
      where: {
        id,
      },
      data: updateFriendDto,
    });
  }

  remove(id: number) {
    return this.prisma.friend.delete({
      where: {
        id,
      },
    });
  }
}
