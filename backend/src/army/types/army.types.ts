import { Unit } from '@prisma/client';

export interface Army {
  id: string;
  cityId: string;
  createdAt: Date;
  updatedAt: Date;
  units?: Unit[];
}
