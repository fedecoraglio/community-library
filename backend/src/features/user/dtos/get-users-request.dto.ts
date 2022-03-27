import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRoleEnum } from '../user-roles/user-role.enum';

export class GetUsersRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
