import { UserDto } from '../../core/user/user.dtos';

export type CreateUserRequestDto = Readonly<{
  name: string;
  email?: string;
  password?: string;
  //permissions?: Permission[];
}>;

export type GetUsersRequestDto = Readonly<{
  page?: number;
  pageSize?: number;
  //role?: UserRole;
  //team?: boolean;
}>;

export type GetUsersResponseDto = Readonly<{
  users: UserDto[];
  total: number;
}>;

export type UpdateUserRequestDto = Readonly<{
  name: string;
  email: string;
  password?: string;
  //permissions?: Permission[];
}>;
