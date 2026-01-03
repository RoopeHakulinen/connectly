import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
  type: ActivityType;
  timestamp?: string;
}
