import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserRatingsService } from './userRatings.service';
import { AddRatingDto } from './dtos/add-rating.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class UserRatingsController {
  constructor(private readonly userRatingsService: UserRatingsService) {}

  @Post()
  async addRating(@Body() addRatingDto: AddRatingDto, @Request() req) {
    const userId = req.user.id;
    return this.userRatingsService.addRating(userId, addRatingDto);
  }
}
