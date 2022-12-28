import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { CreateFeeRequestDto } from './dtos/create-fee-request.dto';
import { GetFeeMemberDto } from './dtos/get-fee-member.dto';
import { GetFeeRequestDto } from './dtos/get-fee-request.dto';
import { PaidFeeRequestDto } from './dtos/paid-fee-request.dto';
import { AMOUNT_FEE_MONTHLY, Fee, FeeDocument } from './fee.schema';

@Injectable()
export class FeeRepository {
  private readonly logger = new Logger(FeeRepository.name);
  constructor(
    @InjectModel(Fee.name)
    private readonly feeModel: Model<FeeDocument>,
  ) {}

  async create(fee: CreateFeeRequestDto): Promise<LeanDocument<FeeDocument>> {
    const validateFee = await this.findOneByMemberMonthYear({
      memberId: fee.member,
      month: fee.month,
      year: fee.year,
    });
    if (validateFee) {
      throw `The fee for ${fee.member} already exists. Month/Year: ${fee.month}/${fee.year}`;
    }

    return (
      await new this.feeModel({
        ...fee,
        feeDate: new Date(fee.year, fee.month, 1),
        feeNumber: fee.month,
        amount: AMOUNT_FEE_MONTHLY,
        uid: new Date().getTime(),
      }).save()
    ).toObject();
  }

  async paidFee(dto: PaidFeeRequestDto): Promise<LeanDocument<FeeDocument>> {
    const validateFee = await this.findOneById(dto.feeId);
    if (!validateFee) {
      throw `The fee does not exists`;
    }

    const dbFee = await this.feeModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(dto.feeId) },
        { amountPaid: dto.amountPaid, paidAt: new Date() } as any,
        {
          new: false,
        },
      )
      .exec();

    return dbFee.toObject();
  }

  async findAll(
    { skip, limit }: PaginationOptions,
    params: GetFeeRequestDto | null = null,
  ): Promise<{
    fees: LeanDocument<FeeDocument>[];
    total: number;
  }> {
    let filter: any = {};

    if (params?.query) {
      const searchOption = {
        $regex: '.*' + params.query + '.*',
        $options: 'i',
      };
      filter = {
        $or: [{ uid: searchOption }],
      };
    }
    const fees = await this.feeModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ feeDate: -1 })
      .exec();

    const total = await this.feeModel.count(filter).exec();
    return {
      fees: fees.map((fee) => fee.toObject()),
      total,
    };
  }

  async findOneById(id: string): Promise<LeanDocument<FeeDocument>> {
    try {
      return (await this.feeModel.findById(id).exec()).toObject();
    } catch (err) {
      this.logger.error(err.message);
      return null;
    }
  }

  async findOneByMemberMonthYear(
    param: GetFeeMemberDto,
  ): Promise<LeanDocument<FeeDocument>> {
    let filter: any = {};
    const { memberId, month, year } = param;

    if (memberId && month && year) {
      filter = {
        $and: [{ member: new Types.ObjectId(memberId), month, year }],
      };
    } else {
      throw `All parameters are required`;
    }
    return await this.feeModel.findOne(filter).exec();
  }
}
