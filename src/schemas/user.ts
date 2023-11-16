import { object, string, TypeOf } from 'zod';

export const login = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
  }),
});

export const complete = object({
  query: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    verificationCode: string({
      required_error: 'Verification code is required',
    }),
  }),
});

export type CreateInput = TypeOf<typeof login>['body'];
export type QueryInput = TypeOf<typeof complete>['query'];
