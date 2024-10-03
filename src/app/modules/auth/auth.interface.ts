/* eslint-disable no-unused-vars */


export type IUser  = {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: 'user' | 'donor' | 'admin';
  donor_id?: string;
  address?: string;
  city?: string;
  age?: number;
  blood_group?: string;
  weight?: number;
  last_donation_date?: Date;
  is_available?: boolean;
  donor_type?: 'new' | 'older';
  donate_time?: number;
  image_url?: string;
}


export type ILogInUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
  email: string;
};

// export type UserModel = {
//   isUserExist(
//     email: string
//   ): Promise<Pick<IUser, '_id' | 'password' | 'email' | 'role'>>;
//   isPasswordMatched(
//     givenPassword: string,
//     savedPassword: string
//   ): Promise<boolean>;
// } & Model<IUser>;
