import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      authType: 'local' | 'dev-bypass';
    }

    interface Request {
      user?: User;
    }
  }
}
