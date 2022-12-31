import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BinaryLike, pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_USER } from './interfaces/user.interface';
import { SignupDto } from '../dtos/signup.dto';
import { EditProfileDto } from './dtos/edit-profile.dto';

const pbkdf2Async = promisify<
  BinaryLike,
  BinaryLike,
  number,
  number,
  string,
  Buffer
>(pbkdf2);

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    // this.seedUser();
  }

  async seedUser() {
    const userDoc = new this.usersModel({
      email: 'jatin4228@gmail.com',
      password: await this.hashPassword('password'),
      birthDate: new Date(),
      name: 'Jatin',
      username: 'jatinParate',
    }) as UserDocument;

    await userDoc.save();
    this.logger.debug(`User created`);
  }

  async hashPassword(password: string) {
    try {
      const hashedPassword = await pbkdf2Async(
        password,
        this.configService.get('PASSWORD_SALT')!,
        1000,
        64,
        'sha512',
      );

      return hashedPassword.toString('hex');
    } catch (err) {
      this.logger.error('While hashing password', err.stack);
      throw new InternalServerErrorException();
    }
  }

  private async saveToCache(email: string, user: UserDocument): Promise<void> {
    try {
      await this.cacheManager.set(
        email,
        JSON.stringify(user.toJSON()),
        1800, // half an hour
      );
    } catch (err) {
      this.logger.error(`in saveToCache for ${email}`, err.stack);
    }
  }

  private async getFromCache(email: string) {
    const data = await this.cacheManager.get<string>(email);
    if (data) {
      return JSON.parse(data) as CACHE_USER;
    }

    return undefined;
  }

  async getByEmail(email: string) {
    try {
      const userData = await this.getFromCache(email);
      if (userData) {
        return userData;
      }

      const user = await this.usersModel.findOne({ email }).exec();
      if (user) {
        await this.saveToCache(email, user);
      }
      return user;
    } catch (err) {
      this.logger.error(
        `Error while finding user by mail: ${email}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to fetch user by email!');
    }
  }

  async getByUserName(userName: string): Promise<null | UserDocument> {
    try {
      return await this.usersModel
        .findOne({
          username: userName,
        })
        .exec();
    } catch (err) {
      this.logger.error(`Error while getByUserName: ${userName}`, err.stack);
      throw new InternalServerErrorException(
        'Failed to fetch user by username!',
      );
    }
  }

  async createUser({ password, ...signupDto }: SignupDto) {
    try {
      return await this.usersModel.create({
        ...signupDto,
        password: await this.hashPassword(password),
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      this.logger.error('Error while creating user', err.stack, signupDto);
      throw new InternalServerErrorException();
    }
  }

  async updateByDto(
    email: string,
    editProfileDto: EditProfileDto,
    newProfileUrl?: string,
  ) {
    try {
      const data = { ...editProfileDto } as any;
      if (newProfileUrl) {
        data.profilePictureURL = newProfileUrl;
      }
      const updatedUser = await this.usersModel
        .findOneAndUpdate({ email }, data, {
          new: true,
        })
        .select({ password: 0 });
      await this.deleteFromCache(email);
      return updatedUser;
    } catch (err) {
      this.logger.error(`Error in updateByDto: ${email}`, err.stack);
      throw new InternalServerErrorException();
    }
  }

  private async deleteFromCache(email: string) {
    try {
      await this.cacheManager.del(email);
    } catch (err) {
      this.logger.error(`in deleteFromCache: ${email}`, err.stack);
    }
  }
}
