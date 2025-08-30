import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { User } from './users/user.entity';
import { Genre } from './genres/genre.entity';
import { Movie } from './movies/entities/movie.entity';
import { MovieGenre } from './movies/entities/movieGenre.entity';
import { WatchList } from './watchList/watchList.entity';
import { UserRating } from './userRatings/userRating.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Genre, Movie, MovieGenre, WatchList, UserRating]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
