import { FlattenMaps, LeanDocument } from 'mongoose';

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  birthDate: Date;
  bio?: string;
  website?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  profilePictureURL?: string;
}

export type CACHE_USER = FlattenMaps<LeanDocument<IUser & { _id: string }>>;
