import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export interface TargetWithDeadline {
  id: number;
  name: string;
  type: string;
  notes: string;
  lastActivity: Date | null;
  deadline: Date;
  isOverdue: boolean;
  tier: {
    id: number;
    interval: string;
  };
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUpcomingDeadlines(
    userId: number,
    limit: number = 7,
  ): Promise<TargetWithDeadline[]> {
    const targets = await this.prisma.target.findMany({
      where: { userId },
      include: {
        tier: true,
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const now = new Date();

    const targetsWithDeadlines = targets.map((target) => {
      const lastActivity =
        target.activities.length > 0 ? target.activities[0].timestamp : null;
      const deadline = this.calculateDeadline(
        lastActivity,
        target.tier.interval,
      );
      const isOverdue = deadline < now;

      return {
        id: target.id,
        name: target.name,
        type: target.type,
        notes: target.notes,
        lastActivity,
        deadline,
        isOverdue,
        tier: {
          id: target.tier.id,
          interval: target.tier.interval,
        },
      };
    });

    targetsWithDeadlines.sort(
      (a, b) => a.deadline.getTime() - b.deadline.getTime(),
    );

    return targetsWithDeadlines.slice(0, limit);
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
