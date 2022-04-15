import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../member.gender';

export class CreateMemberRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender, {
    message: `Gender not valid`,
  })
  gender: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsOptional()
  cityId: string;

  @ApiProperty()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsOptional()
  stateId: string;
}
