'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import * as database from './utils/database';
import * as cache from './utils/cache';
import authRouter from './routes/auth';
import userRouter from './routes/user';

const port = config.get<number>('port');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('morgan')('dev'));
  app.use(cors({ origin: config.get<string>('origin'), credentials: true }));
}

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('pong');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  database.connect();
  cache.connect();
});
