import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';
import { FeeStatus } from '../fee-status.enum';

export class CreateFeeRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNumberString()
  @Length(4)
  year: number;

  @ApiProperty()
  @IsNumber()
  @IsNumberString()
  @MaxLength(2)
  month: number;

  @ApiProperty()
  @IsNumber()
  @IsNumberString()
  @MaxLength(2)
  feeNumber: number;

  @ApiProperty()
  @IsOptional()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(FeeStatus, {
    message: `Status not valid`,
  })
  status: string;

  @ApiProperty()
  member: string;
}
