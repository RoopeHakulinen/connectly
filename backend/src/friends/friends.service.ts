import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  create(createFriendDto: CreateFriendDto) {
    return 'This action adds a new friend';
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
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return this.prisma.friend.delete({
      where: {
        id,
      },
    });
  }
}
