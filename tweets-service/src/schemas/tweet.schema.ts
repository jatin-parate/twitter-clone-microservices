import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ITweet } from '../interfaces/tweet.interface';
import { ReplyTo } from './reply-to.schema';

export type TweetDocument = Document & Tweet;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
export class Tweet implements ITweet {
  _id: ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop()
  createdAt: Date;

  @Prop({ required: true })
  ownerEmail: string;

  @Prop({ required: true, type: Number, default: 0 })
  totalLikes = 0;

  @Prop({ required: false })
  replyTo?: ReplyTo;
}

export const tweetSchema = SchemaFactory.createForClass(Tweet);
