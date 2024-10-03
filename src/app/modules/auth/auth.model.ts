/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import mongoose, { Schema} from 'mongoose';
import { IUser } from './auth.interface';





const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'donor', 'admin'], default: 'user' },
  // Donor fields (optional)
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

// Pre-save hook for password hashing
UserSchema.pre<IUser>('save', async function (next) {
  //@ts-ignore
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password match
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
