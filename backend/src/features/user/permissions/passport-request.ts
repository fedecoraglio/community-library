import { UserDto } from '../dtos/user.dto';

export interface PassportUser extends Omit<UserDto, '_id'> {
  id: string;
}

export interface PassportRequest {
  user: PassportUser;
}
