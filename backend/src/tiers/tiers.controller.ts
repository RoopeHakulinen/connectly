import { Controller, Get } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('tiers')
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.tiersService.findAll(user.id);
  }
}
