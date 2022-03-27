import { Exclude, Transform, Type } from 'class-transformer';
import { UserDocument } from '../user.schema';
import { LeanDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { ExposeObjectId } from '../../../core/decorators/expose-object-id';

export class UserDto {
  @ExposeObjectId() _id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  permissions: string[];
  @Exclude() password?: string;
  @Exclude() created?: Date;
  @Exclude() reset_password_token?: string;
  @Exclude() reset_password_token_expire?: Date;

  constructor(user: LeanDocument<UserDocument>, secretToken?: string) {
    Object.assign(
      this,
      {
        email: '',
        permissions: [],
      },
      user,
    );
  }
}
