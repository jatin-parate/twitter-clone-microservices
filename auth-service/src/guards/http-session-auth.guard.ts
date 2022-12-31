import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ISessionInstance } from 'src/interfaces/app-session.interface';

@Injectable()
export class HttpSessionAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    if (!(req.session as ISessionInstance).email) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
