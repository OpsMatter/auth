import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

@index({ email: 1 })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Auth {
  @prop({ unique: true, required: true })
  email!: string;

  @prop({ required: true })
  accessToken!: string;

  @prop({ required: true })
  verificationCode!: number;
}

const authModel = getModelForClass(Auth);

export default authModel;
