import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { UserService } from './user.service';
import { ISessionInstance } from '../interfaces/app-session.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpSessionAuthGuard } from '../guards/http-session-auth.guard';
import { EditProfileDto } from './dtos/edit-profile.dto';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(HttpSessionAuthGuard)
  @Post('editProfile')
  @UseInterceptors(FileInterceptor('avatar'))
  async editProfile(
    @Req() req: Request,
    @Body() body: EditProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const session = req.session as ISessionInstance;
    let profilePictureURL: string | undefined = undefined;

    if (avatar) {
      const newFileName =
        session.email + '.' + avatar.originalname.split('.').at(-1)!;
      writeFileSync(resolve('public', 'avatars', newFileName), avatar.buffer);
      profilePictureURL = `${process.env.HOST}/avatars/${newFileName}`;
    }

    return await this.usersService.updateByDto(
      session.email,
      body,
      profilePictureURL,
    );
  }
}
