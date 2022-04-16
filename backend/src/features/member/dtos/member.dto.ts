import { LeanDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { ExposeObjectId } from '../../../core/decorators/expose-object-id';
import { MemberDocument } from '../member.schema';

export class MemberDto {
  @ExposeObjectId() _id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  birthday: Date;

  constructor(member: LeanDocument<MemberDocument>) {
    Object.assign(this, member);
  }
}
