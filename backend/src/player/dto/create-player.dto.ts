import { IsString, Length, Matches } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/)
  name: string;

  @IsString()
  worldId: string;
}
