import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { IReplyTo } from '../interfaces/tweet.interface';

export class ReplyTo implements IReplyTo {
  _id: ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  ownerEmail: string;
}
