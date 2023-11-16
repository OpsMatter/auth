import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user';
import AppError from '../utils/appError';
import * as cache from '../utils/cache';
import * as jwt from '../utils/jwt';

export const deserialiseUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies.access_token;

    if (!accessToken) {
      return next(new AppError('You are not logged in', 401));
    }

    const decoded = jwt.verify<{ sub: string }>(accessToken);
    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }

    const session = await cache.client.get(decoded.sub);
    if (!session) {
      return next(new AppError(`User session has expired`, 401));
    }

    const user = await userService.findById(JSON.parse(session)._id);
    if (!user) {
      return next(new AppError(`User with that token no longer exist`, 401));
    }

    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
