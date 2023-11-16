import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

@index({ email: 1 })
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ unique: true, required: true })
  email!: string;
}

const userModel = getModelForClass(User);

export default userModel;
