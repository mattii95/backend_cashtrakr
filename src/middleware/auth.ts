import { Request, Response, NextFunction } from 'express'
import { checkToken } from '../utils/jwt';
import User from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error('Unauthorised');
    res.status(401).json({ error: error.message });
    return;
  }

  const [, token] = bearer.split(' ');
  if (!token) {
    const error = new Error('Invalid Token');
    res.status(401).json({ error: error.message });
    return;
  }

  try {
    const decoded = checkToken(token);
    if (typeof decoded === 'object' && decoded.id) {
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email']
      });
      req.user = user;
      next();
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Token no valido' });
  }
}