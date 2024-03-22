import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Genre } from 'src/entity/genreEntity';

export class MovieCreationValidator {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  originalName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  localizedName: string;

  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 20)
  releaseYear: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description: string;

  @IsUUID(null, { each: true })
  genres: Genre[];
}

export class MovieUpdatingValidator {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  originalName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  localizedName?: string;

  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 20)
  @IsOptional()
  releaseYear?: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @IsOptional()
  description?: string;

  @IsUUID(null, { each: true })
  @IsOptional()
  genres?: Genre[];
}

export enum SortEnum {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export class MovieSortOptions {
  @IsOptional()
  @IsString()
  @IsEnum(SortEnum)
  ratingSort?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  @IsEnum(SortEnum)
  releaseYearSort: 'ASC' | 'DESC';
}

export class MovieFilterOptions {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  originalName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  localizedName?: string;

  @IsOptional()
  @Min(1800)
  @Max(new Date().getFullYear() + 20)
  @IsNumber()
  releaseYear?: number;

  @IsOptional()
  @Min(0)
  @Max(10)
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsUUID(null, { each: true })
  genres?: string;

  @IsOptional()
  @IsNumber()
  take?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;
}
