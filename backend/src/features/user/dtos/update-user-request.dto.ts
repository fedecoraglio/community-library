import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Permission } from '../permissions/permission';

export class UpdateUserRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(8, 16)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Permission, {
    message: 'permissions are invalid',
    each: true,
  })
  permissions?: string[];
}
