import { User } from '@interfaces/users.interface';
import { Document, model, Schema } from 'mongoose';

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
}

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: Gender,
    required: true,
    default: '',
  },
  birthday: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
