import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateInput, QueryInput } from '../schemas/user';
import * as authService from '../services/auth';
import * as userService from '../services/user';
import * as mailerService from '../services/mailer';
import AppError from '../utils/appError';

const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
  ...(process.env.NODE_ENV === 'production' ? { secure: true } : {}),
};

export const loginHandler = async (
  req: Request<object, object, CreateInput>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await userService.findOrCreate({ email });
    const { accessToken } = await userService.signToken(user);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await authService.createSession({ email, accessToken, verificationCode });
    await mailerService.send({
      email,
      verificationCode: Buffer.from(String(verificationCode)).toString(
        'base64'
      ),
    });

    res.status(201).json({ status: 'success' });
  } catch (err: any) {
    next(err);
  }
};

export const completeHandler = async (
  req: Request<object, object, object, QueryInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, verificationCode } = req.query;
    if (!email) {
      return next(new AppError('Missing email'));
    }
    if (!verificationCode) {
      return next(new AppError('Missing verification code'));
    }

    const user = await userService.find({ email });
    if (!user) {
      return next(new AppError('Invalid email'));
    }

    const session = await authService.findSession({
      email,
      verificationCode: Number(
        Buffer.from(verificationCode, 'base64').toString()
      ),
    });

    if (!session) {
      return next(new AppError('Invalid session'));
    }

    res.cookie(
      'accessToken',
      session.verificationCode,
      accessTokenCookieOptions
    );
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res
      .status(200)
      .json({ status: 'success', accessToken: session.accessToken });
  } catch (err: any) {
    next(err);
  }
};
