import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Permission } from '../permissions/permission';

export class CreateUserRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 16)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Permission, {
    message: 'permissions are invalid',
    each: true,
  })
  permissions?: string[];
}
