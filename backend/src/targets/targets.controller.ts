import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TargetsService } from './targets.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createTargetDto: CreateTargetDto) {
    return this.targetsService.create(createTargetDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.targetsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.targetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTargetDto: UpdateTargetDto) {
    return this.targetsService.update(+id, updateTargetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.targetsService.remove(+id);
  }
}
