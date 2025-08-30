import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WatchListService } from './watchList.service';
import { AddToWatchListDto } from './dtos/add-to-watchList.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchListController {
  constructor(private readonly watchListService: WatchListService) {}

  @Post()
  async addToWatchList(@Body() addToWatchListDto: AddToWatchListDto, @Request() req) {
    const userId = req.user.id;
    return this.watchListService.addToWatchList(userId, addToWatchListDto);
  }
}
