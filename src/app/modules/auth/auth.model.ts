import { IUser } from './auth.interface';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'donor', 'admin'], default: 'user' },
  donor_id: { type: String },
  address: { type: String },
  city: { type: String },
  age: { type: Number },
  blood_group: { type: String },
  weight: { type: Number },
  last_donation_date: { type: Date },
  is_available: { type: Boolean, default: true },
  donor_type: { type: String, enum: ['new', 'older'] },
  donate_time: { type: Number, default: 0 },
  image_url: { type: String },
});

//Pre-Save Hook: password hashing

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (user.isModified('password') || user.isNew) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bycrypt_salt_rounds)
    );
  }
  next();
});

//check user exit  Static Method
UserSchema.statics.isUserExist = async function (
  email: string
): Promise<IUser | null> {
  return await this.findOne(
    { email },
    { _id: 1, password: 1, role: 1, email: 1 }
  );
};

// check  password match  Static Method

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
