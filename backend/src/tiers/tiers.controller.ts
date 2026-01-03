import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';

@Controller('tiers')
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createTierDto: CreateTierDto) {
    return this.tiersService.create(createTierDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.tiersService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tiersService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateTierDto: UpdateTierDto,
  ) {
    return this.tiersService.update(+id, user.id, updateTierDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tiersService.remove(+id, user.id);
  }
}
