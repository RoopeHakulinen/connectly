import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {
  }

  @Cron('0 10 * * *', { timeZone: 'UTC' })
  async checkUpcomingDeadlines() {
    this.logger.log('Running daily deadline check...');

    const targets = await this.prisma.target.findMany({
      include: {
        tier: true,
        user: true,
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const upcomingTargets = targets.filter((target) => {
      const lastActivity =
        target.activities.length > 0 ? target.activities[0].timestamp : null;
      const deadline = this.calculateDeadline(
        lastActivity,
        target.tier.interval,
      );
      console.log(deadline.toISOString());

      const isWithinThreeDays = deadline > now && deadline <= threeDaysFromNow;
      if (!isWithinThreeDays) {
        return false;
      }

      const alreadyNotified =
        target.threeDaysBeforeNotificationSentAt !== null &&
        (lastActivity === null ||
          target.threeDaysBeforeNotificationSentAt > lastActivity);

      return !alreadyNotified;
    });

    if (upcomingTargets.length === 0) {
      this.logger.log('No targets with deadlines in the next 3 days.');
      return;
    }

    this.logger.log(
      `Found ${upcomingTargets.length} target(s) with deadlines in the next 3 days:`,
    );

    for (const target of upcomingTargets) {
      const lastActivity =
        target.activities.length > 0 ? target.activities[0].timestamp : null;
      const deadline = this.calculateDeadline(
        lastActivity,
        target.tier.interval,
      );

      this.logger.log(
        `- Target: "${target.name}" (ID: ${target.id}, User: ${target.user.email}) | Deadline: ${deadline.toISOString()}`,
      );

      await this.prisma.target.update({
        where: { id: target.id },
        data: { threeDaysBeforeNotificationSentAt: now },
      });
    }
  }

  private calculateDeadline(lastActivity: Date | null, interval: string): Date {
    const baseDate = lastActivity ? new Date(lastActivity) : new Date(0);
    const duration = this.parseICalInterval(interval);
    return new Date(baseDate.getTime() + duration);
  }

  private parseICalInterval(interval: string): number {
    const freqMatch = interval.match(/FREQ=(\w+)/i);
    const intervalMatch = interval.match(/INTERVAL=(\d+)/i);

    const freq = freqMatch ? freqMatch[1].toUpperCase() : 'WEEKLY';
    const intervalNum = intervalMatch ? parseInt(intervalMatch[1], 10) : 1;

    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    switch (freq) {
      case 'DAILY':
        return intervalNum * MS_PER_DAY;
      case 'WEEKLY':
        return intervalNum * 7 * MS_PER_DAY;
      case 'MONTHLY':
        return intervalNum * 30 * MS_PER_DAY;
      case 'YEARLY':
        return intervalNum * 365 * MS_PER_DAY;
      default:
        return 7 * MS_PER_DAY;
    }
  }
}
