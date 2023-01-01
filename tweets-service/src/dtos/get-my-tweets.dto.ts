import { SortDirection, SortTweetOptions } from '../gql.types';
import { IsMongoId, IsOptional } from 'class-validator';

export default class GetMyTweetsDto {
  @IsOptional()
  sortDirection?: SortDirection;

  @IsOptional()
  sort?: SortTweetOptions;

  @IsOptional()
  limit?: number;

  @IsOptional()
  skipPages?: number;

  @IsOptional()
  @IsMongoId()
  after?: string;

  @IsOptional()
  @IsMongoId()
  before?: string;
}
