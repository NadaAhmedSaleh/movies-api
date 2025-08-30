import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { SharedJwtModule } from '../common/modules/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedJwtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
