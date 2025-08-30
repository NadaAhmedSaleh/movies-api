import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortBy {
  RATING = 'rating',
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class MovieFiltersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(v => parseInt(v));
    }
    return [parseInt(value)];
  })
  genres?: number[];

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.RATING;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;
}

export class AuthenticatedMovieFiltersDto extends MovieFiltersDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  watchListOnly?: boolean = false;
}
