import { IsNumber, IsInt } from 'class-validator';

export class AddToWatchListDto {
  @IsNumber()
  @IsInt()
  movieId: number;
}
