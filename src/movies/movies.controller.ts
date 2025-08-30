import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthenticatedMovieFiltersDto, MovieFiltersDto } from './dtos';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async listMovies(@Query() filters: MovieFiltersDto, @Request() req) {
    return this.moviesService.listMovies(filters);
  }

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  async authenticatedListMovies(
    @Query() filters: AuthenticatedMovieFiltersDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.moviesService.listMovies(filters, userId);
  }
}
