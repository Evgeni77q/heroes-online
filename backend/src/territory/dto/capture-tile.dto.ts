import { IsInt, IsString } from 'class-validator';

export class CaptureTileDto {
  @IsString()
  attackerCityId: string;

  @IsString()
  mapId: string;

  @IsInt()
  x: number;

  @IsInt()
  y: number;
}
