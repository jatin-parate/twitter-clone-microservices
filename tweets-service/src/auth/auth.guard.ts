import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, map, catchError, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from '../interfaces/auth-api.interface';
import type { Request } from 'express';
import type { AxiosError } from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly AUTH_URL = this.configService.get<string>('AUTH_API_URL');

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();

    return this.httpService
      .get<UserResponse>('/currentUser', {
        baseURL: this.AUTH_URL,
        headers: {
          Cookie: req.get('Cookie'),
        },
      })
      .pipe(
        map((res) => {
          req.user = res.data;
          return true;
        }),
        catchError((err: AxiosError) => {
          if (err.response?.status === 401) {
            return of(false);
          }

          throw err;
        }),
      );
  }
}
