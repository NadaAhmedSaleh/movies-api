import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRatingsController } from './userRatings.controller';
import { UserRatingsService } from './userRatings.service';
import { UserRating } from './userRating.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MoviesModule } from '../movies/movies.module';
import { SharedJwtModule } from '../common/modules/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRating]),
    MoviesModule,
    SharedJwtModule,
  ],
  controllers: [UserRatingsController],
  providers: [UserRatingsService, JwtAuthGuard],
  exports: [UserRatingsService],
})
export class UserRatingsModule {}
