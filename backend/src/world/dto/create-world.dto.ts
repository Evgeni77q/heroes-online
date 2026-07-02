import { IsOptional, IsString, Length } from 'class-validator';

export class CreateWorldDto {
  @IsString()
  @Length(3, 32)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
