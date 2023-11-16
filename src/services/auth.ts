import authModel, { Auth } from '../models/auth';

export const findSession = async (input: Partial<Auth>) =>
  authModel.findOne(input);

export const createSession = async (input: Partial<Auth>) => {
  const { email } = input;

  const session = await findSession({ email });

  if (!session) {
    return authModel.create(input);
  }

  return authModel.updateOne({ email }, input);
};
