import { IsInt, IsString, Max, Min } from 'class-validator';

export class UpgradeBuildingDto {
  @IsString()
  buildingId: string;

  @IsString()
  cityId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  level: number;
}
