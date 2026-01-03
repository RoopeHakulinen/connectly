import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('upcoming')
  getUpcomingDeadlines(@CurrentUser() user: User) {
    return this.dashboardService.getUpcomingDeadlines(user.id, 7);
  }
}
