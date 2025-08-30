import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { UserRatingsModule } from '../userRatings/userRatings.module';
import { WatchListModule } from '../watchList/watchList.module';
import { SharedJwtModule } from '../common/modules/jwt.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    SharedJwtModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, JwtAuthGuard],
  exports: [MoviesService],
})
export class MoviesModule {}
