import { Request } from 'express';
import { Session, SessionData } from 'express-session';
import type { User } from '@shared/schema';

export interface UserSession extends SessionData {
  user?: {
    id: string;
    email: string | null;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  session: Session & Partial<UserSession>;
}

export interface RequestWithUser extends Request {
  user: User;
  session: Session & Partial<UserSession>;
}
