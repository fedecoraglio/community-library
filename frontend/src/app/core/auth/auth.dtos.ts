import { UserDto } from '../user/user.dtos';

export type ResetPasswordRequestDto = Readonly<{
  email: string;
}>;

export type SetPasswordRequestDto = Readonly<{
  reset_password_token: string;
  password: string;
}>;

export type LoginResponseDto = Readonly<{
  access_token: string;
  user: UserDto;
}>;

export type RefreshTokenResponseDto = Readonly<{
  access_token: string;
  user: UserDto;
}>;
