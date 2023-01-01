import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Tweet, TweetDocument } from './schemas/tweet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SortDirection, SortTweetOptions } from './gql.types';
import GetMyTweetsDto from './dtos/get-my-tweets.dto';

@Injectable()
export class AppService {
  logger = new Logger(AppService.name);

  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>,
  ) {}

  async findAll(
    {
      limit = 10,
      skipPages = 0,
      sort = SortTweetOptions.CREATED_AT,
      sortDirection = SortDirection.DESC,
      before,
      after,
    }: GetMyTweetsDto,
    email?: string,
  ) {
    try {
      const findQuery: any = {};
      if (before) {
        findQuery._id = { $lt: new Types.ObjectId(before) };
      } else if (after) {
        findQuery._id = { $gt: new Types.ObjectId(after) };
      }
      if (email) {
        findQuery.ownerEmail = email;
      }
      return await this.tweetModel
        .find(findQuery)
        .sort({
          [sort]: sortDirection,
        })
        .skip(skipPages * limit)
        .limit(limit)
        .exec();
    } catch (err) {
      this.logger.error('findAll', err.stack);
      throw new InternalServerErrorException();
    }
  }
}
