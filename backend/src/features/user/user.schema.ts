import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Permission } from './permissions/permission';

@Schema()
export class User {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  email: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  password: string;

  @Prop({
    type: MongooseSchema.Types.Array,
    of: MongooseSchema.Types.String,
    default: [],
    required: false,
  })
  permissions: Permission[];

  @Prop({
    type: Date,
    default: Date.now,
    required: true,
  })
  created: Date;
}

export type UserDocument = User & Document;
export const userSchema = SchemaFactory.createForClass(User);
