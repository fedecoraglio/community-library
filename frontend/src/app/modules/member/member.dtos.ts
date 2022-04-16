import { UserDto } from '../../core/user/user.dtos';

export type CreateMemberRequestDto = Readonly<{
  name: string;
  gender: string;
  address: string;
  birthday: Date;
  phone: string;
}>;

export type GetMemberRequestDto = Readonly<{
  page?: number;
  pageSize?: number;
}>;

export type GetMemberResponseDto = Readonly<{
  members: MemberDto[];
  total: number;
}>;

export type MemberDto = Readonly<{
  id: string;
  email: string;
  name: string;
  gender: string;
  address: string;
  city: string;
  cityId: string;
  state: string;
  stateId: string;
  birthday: Date;
}>;
