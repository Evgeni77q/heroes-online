export class WorldResponseDto {
  id: string;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}
