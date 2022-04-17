import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { getEnumValues } from '../../core/utils/get-enum-values';
import { FeeStatus } from './fee-status.enum';
import { Member } from '../member/member.schema';

export const AMOUNT_FEE_MONTHLY = 250;

@Schema({ autoIndex: true })
export class Fee {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  uid: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  year: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  month: number;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: getEnumValues(FeeStatus),
    required: true,
    default: FeeStatus.Pending,
  })
  status: FeeStatus;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: AMOUNT_FEE_MONTHLY,
    required: true,
  })
  amount: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: new Date().getMonth(),
    required: true,
  })
  feeNumber: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Member.name,
    required: true,
  })
  member: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
  })
  feeDate: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: new Date().setDate(new Date().getDate() + 20),
    required: true,
  })
  expireAt: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: new Date(),
    required: true,
  })
  paidAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
    required: true,
  })
  createdAt: Date;
}

export type FeeDocument = Fee & Document;
export const feeSchema = SchemaFactory.createForClass(Fee);
feeSchema.index({ year: 1, month: 1, member: 1 }, { unique: true });
