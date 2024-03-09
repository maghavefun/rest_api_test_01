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

export class CreateMovie {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  original_name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  localized_name: string;

  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 20)
  release_year: number;

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
  genres: string[];
}

export class UpdateMovie {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  original_name?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  localized_name?: string;

  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 20)
  @IsOptional()
  release_year?: number;

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
  genres?: string[];
}

export enum SortEnum {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export class MovieSortOptions {
  @IsOptional()
  @IsString()
  @IsEnum(SortEnum)
  rating_sort?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  @IsEnum(SortEnum)
  release_year_sort: 'ASC' | 'DESC';
}

export class MovieFilterOptions {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  original_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  localized_name?: string;

  @IsOptional()
  @Min(1800)
  @Max(new Date().getFullYear() + 20)
  @IsNumber()
  release_year?: number;

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
