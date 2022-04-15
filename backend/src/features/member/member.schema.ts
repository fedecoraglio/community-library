import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Gender } from './member.gender';
import { getEnumValues } from '../../core/utils/get-enum-values';

@Schema()
export class Member {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  uid: string;

  @Prop({
    type: MongooseSchema.Types.Boolean,
    required: true,
    default: true,
  })
  active: boolean;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: getEnumValues(Gender),
    required: false,
  })
  gender: Gender;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  email: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  address: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  city: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  cityId: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  state: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  stateId: string;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
    required: false,
  })
  birthday: Date;

  @Prop({
    type: Date,
    default: Date.now,
    required: true,
  })
  created: Date;
}

export type MemberDocument = Member & Document;
export const memberSchema = SchemaFactory.createForClass(Member);
