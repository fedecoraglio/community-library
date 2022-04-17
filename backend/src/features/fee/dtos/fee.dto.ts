import { LeanDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { ExposeObjectId } from '../../../core/decorators/expose-object-id';
import { MemberDto } from '../../member/dtos/member.dto';
import { Type } from 'class-transformer';
import { FeeDocument } from '../fee.schema';

export class FeeDto {
  @ExposeObjectId() _id: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  month: number;
  @ApiProperty()
  @Type(() => MemberDto)
  member: MemberDto;
  @ApiProperty()
  expireAt: Date;
  @ApiProperty()
  paidAt: Date;
  @ApiProperty()
  createdAt: Date;

  constructor(fee: LeanDocument<FeeDocument>) {
    Object.assign(this, fee);
  }
}
