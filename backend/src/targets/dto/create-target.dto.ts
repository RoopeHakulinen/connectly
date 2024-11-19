import { TargetType } from '@prisma/client';

export class CreateTargetDto {
  name: string;
  type: TargetType;
  notes: string;
  tierId: number;
}
