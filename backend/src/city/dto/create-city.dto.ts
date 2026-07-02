import { IsString, Length } from 'class-validator';

export class CreateCityDto {
  @IsString()
  playerId: string;

  @IsString()
  mapId: string;

  @IsString()
  tileId: string;

  @IsString()
  @Length(3, 24)
  name: string;
}
