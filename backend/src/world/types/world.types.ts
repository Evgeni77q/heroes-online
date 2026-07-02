export interface World {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}
