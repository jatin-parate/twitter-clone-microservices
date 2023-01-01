import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import GetMyTweetsDto from './dtos/get-my-tweets.dto';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMyTweets(@Query() query: GetMyTweetsDto, @Req() req: Request) {
    return await this.appService.findAll(query, req.user.email);
  }
}
