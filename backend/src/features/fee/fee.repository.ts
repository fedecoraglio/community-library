import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { CreateFeeRequestDto } from './dtos/create-fee-request.dto';
import { GetFeeRequestDto } from './dtos/get-fee-request.dto';
import { AMOUNT_FEE_MONTHLY, Fee, FeeDocument } from './fee.schema';

@Injectable()
export class FeeRepository {
  private readonly logger = new Logger(FeeRepository.name);
  constructor(
    @InjectModel(Fee.name)
    private readonly feeModel: Model<FeeDocument>,
  ) {}

  async create(fee: CreateFeeRequestDto): Promise<LeanDocument<FeeDocument>> {
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
        $or: [
          { name: searchOption },
          { uid: searchOption },
          { phone: searchOption },
          { email: searchOption },
        ],
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
}
