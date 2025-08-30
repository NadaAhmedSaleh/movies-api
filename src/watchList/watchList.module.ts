import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListController } from './watchList.controller';
import { WatchListService } from './watchList.service';
import { WatchList } from './watchList.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MoviesModule } from '../movies/movies.module';
import { SharedJwtModule } from '../common/modules/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WatchList]),
    MoviesModule,
    SharedJwtModule,
  ],
  controllers: [WatchListController],
  providers: [WatchListService, JwtAuthGuard],
  exports: [WatchListService],
})
export class WatchListModule {}
