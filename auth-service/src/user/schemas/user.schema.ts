import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';
import type { Document } from 'mongoose';

export type UserDocument = Document & User;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User implements IUser {
  @Prop()
  bio?: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  location?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePictureURL?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  website?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(User);
