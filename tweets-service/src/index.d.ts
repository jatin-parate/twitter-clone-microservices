import { UserResponse } from './interfaces/auth-api.interface';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}
