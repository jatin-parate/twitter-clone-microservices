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

export interface UserResponse extends IUser {
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

  password: string;
}
