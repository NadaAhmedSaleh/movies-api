import { IsNumber, IsInt, Min, Max } from 'class-validator';

export class AddRatingDto {
  @IsNumber()
  @IsInt()
  movieId: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;
}
