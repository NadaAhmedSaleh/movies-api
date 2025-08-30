import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchList } from './watchList.entity';
import { MoviesService } from '../movies/movies.service';
import { AddToWatchListDto } from './dtos';

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchList)
    private watchListRepository: Repository<WatchList>,
    private moviesService: MoviesService,
  ) {}

  async addToWatchList(userId: number, addToWatchListDto: AddToWatchListDto) {
    const { movieId } = addToWatchListDto;

   const movie = await this.moviesService.getMovieById(movieId);

    const existingWatchListItem = await this.watchListRepository.findOne({
      where: { userId, movieId },
    });

    if (existingWatchListItem) {
      throw new ConflictException('Movie is already in user watchList');
    }

    const watchListItem = this.watchListRepository.create({
      userId,
      movieId,
    });

    await this.watchListRepository.save(watchListItem);

    return {
      message: `Movie "${movie.name}" added to watchList successfully`,
    };
  }
}
