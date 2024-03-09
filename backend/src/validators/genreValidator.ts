import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Genre } from 'src/entity/genreEntity';

export type TCreateGenre = Pick<Genre, 'name' | 'description'>;

export class CreateGenre implements TCreateGenre {
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description: string;
}

export class UpdateGenre implements Partial<TCreateGenre> {
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @IsOptional()
  description?: string;
}
