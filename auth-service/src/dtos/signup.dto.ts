import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UniqueEmail } from '../validators/unique-email.validator';
import { UniqueUserName } from '../validators/unique-username.validator';
import { IUser } from '../user/interfaces/user.interface';

export class SignupDto
  implements
    Omit<IUser, 'createdAt' | 'updatedAt' | 'profilePictureURL' | 'website'>
{
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthDate: Date;

  @IsNotEmpty()
  @IsEmail()
  // @Validate(UniqueEmailValidator)
  @UniqueEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @UniqueUserName()
  username: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
