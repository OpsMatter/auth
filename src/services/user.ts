import { FilterQuery, QueryOptions } from 'mongoose';
import config from 'config';
import userModel, { User } from '../models/user';
import { sign } from '../utils/jwt';
import { client } from '../utils/cache';
import { DocumentType } from '@typegoose/typegoose';

export const create = async (input: Partial<User>) => userModel.create(input);

export const findById = async (id: string) => userModel.findById(id).lean();

export const find = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => userModel.findOne(query, {}, options);

export const findOrCreate = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  let user = await userModel.findOne(query, {}, options);

  if (!user) {
    user = await create(query);
  }

  return user;
};

export const signToken = async (user: DocumentType<User>) => {
  const accessToken = sign(
    { sub: user._id },
    { expiresIn: `${config.get<number>('accessTokenExpiresIn')}m` }
  );

  client.set(String(user._id), JSON.stringify(user), { EX: 60 * 60 });

  return { accessToken };
};
