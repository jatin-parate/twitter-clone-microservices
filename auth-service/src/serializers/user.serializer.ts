import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { CACHE_USER, IUser } from '../user/interfaces/user.interface';
import { UserDocument } from '../user/schemas/user.schema';

export class UserSerializer implements IUser {
  bio?: string;

  birthDate: Date;

  createdAt: Date;

  email: string;

  location?: string;

  name: string;

  profilePictureURL: string;

  updatedAt: Date;

  username: string;

  website?: string;

  @Exclude()
  password: string;

  constructor(userDocument: UserDocument | CACHE_USER) {
    if (userDocument instanceof Document) {
      const obj = userDocument.toJSON();
      obj._id = userDocument._id.toString();

      Object.assign(this, obj);
    } else {
      Object.assign(this, userDocument);
    }
  }
}
