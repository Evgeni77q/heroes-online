export interface TerritoryResult {
  success: boolean;
  reason?: string;
  previousOwnerId?: string | null;
  newOwnerId?: string | null;
  x: number;
  y: number;
}
