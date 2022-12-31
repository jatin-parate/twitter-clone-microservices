import session from 'express-session';

export interface IAppSession {
  email: string;
}

export type ISessionInstance = session.Session &
  Partial<session.SessionData> &
  IAppSession;
