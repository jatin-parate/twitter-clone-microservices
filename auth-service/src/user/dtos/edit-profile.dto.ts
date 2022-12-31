import { IsOptional } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class EditProfileDto
  implements
    Partial<
      Omit<IUser, 'createdAt' | 'updatedAt' | 'email' | 'password' | 'username'>
    >
{
  @IsOptional()
  name?: string;

  @IsOptional()
  birthdate?: Date;

  @IsOptional()
  bio?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  location?: string;

  _file: Express.Multer.File;
}
