import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class GetUsersResponseDto {
  @ApiProperty({ type: UserDto })
  users: UserDto[];
  @ApiProperty()
  total: number;
}
