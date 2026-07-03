import { IsString } from 'class-validator';

export class UpgradeBuildingDto {
  @IsString()
  buildingId: string;

  @IsString()
  cityId: string;
}
