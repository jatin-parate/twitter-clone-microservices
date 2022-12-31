import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Session,
  Body,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  IAppSession,
  ISessionInstance,
} from './interfaces/app-session.interface';
import { UserDocument } from './user/schemas/user.schema';
import { UserSerializer } from './serializers/user.serializer';
import { Request } from 'express';
import { SignupDto } from './dtos/signup.dto';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private usersService: UserService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Session() session: IAppSession) {
    const userDocument = req.user as UserDocument;
    const serializedUser = new UserSerializer(userDocument);
    session.email = serializedUser.email;

    return serializedUser;
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    // const existingUser = await this.usersService.findDuplicateUser(
    //   signupDto.email,
    //   signupDto.username,
    // );
    // if (existingUser?.email === signupDto.email) {
    //   throw new ConflictException('User with same email already exists!');
    // } else if (existingUser?.username === signupDto.username) {
    //   throw new ConflictException('User with same user name already exists!');
    // }

    const createdUser = await this.usersService.createUser(signupDto);

    return new UserSerializer(createdUser);
  }

  @Get('currentUser')
  async getCurrentUser(@Session() session: ISessionInstance) {
    if (!session.email) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getByEmail(session.email);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    return new UserSerializer(user);
  }
}
