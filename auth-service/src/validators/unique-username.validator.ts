import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
@Injectable()
export class UniqueUsernameValidator implements ValidatorConstraintInterface {
  constructor(private usersService: UserService) {}

  validate = async (username: string) => {
    const existingUser = await this.usersService.getByUserName(username);
    return !Boolean(existingUser);
  };

  defaultMessage() {
    // here you can provide default error message if validation failed
    return 'User name ($value) is already taken!';
  }
}

export function UniqueUserName(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUsernameValidator,
    });
  };
}
