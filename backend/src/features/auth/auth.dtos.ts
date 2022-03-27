import { IsEmail, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user/dtos/user.dto';

export class LoginRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user: UserDto;
}

export class RefreshTokenRequestDto {
  @ApiProperty()
  @IsString()
  access_token: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  access_token: string;
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user: UserDto;
}

export class ResetPasswordRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class SetPasswordRequestDto {
  @ApiProperty()
  @IsString()
  reset_password_token: string;

  @ApiProperty()
  @IsString()
  @Length(8, 16)
  password: string;
}
