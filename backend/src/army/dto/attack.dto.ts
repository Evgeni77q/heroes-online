import { IsString } from 'class-validator';

export class AttackDto {
  @IsString()
  attackerCityId: string;

  @IsString()
  targetCityId: string;
}
