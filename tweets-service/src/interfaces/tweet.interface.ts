import { ObjectId } from 'mongoose';

export type IReplyTo = Omit<ITweet, 'replyTo' | 'totalLikes'>;

export interface ITweet {
  _id: ObjectId;
  text: string;
  createdAt: Date;
  ownerEmail: string;
  totalLikes: number;
  replyTo?: IReplyTo;
}
