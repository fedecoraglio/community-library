import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { ErrorCode } from '../../core/errors/error-code';
import { FeeRepository } from './fee.repository';
import { CreateFeeRequestDto } from './dtos/create-fee-request.dto';
import { FeeDocument } from './fee.schema';
import { GetFeeRequestDto } from './dtos/get-fee-request.dto';
import { GetFeeMemberDto } from './dtos/get-fee-member.dto';

@Injectable()
export class FeeService {
  constructor(private readonly feeRepository: FeeRepository) {}

  async create(fee: CreateFeeRequestDto): Promise<LeanDocument<FeeDocument>> {
    try {
      const dbFee = await this.feeRepository.create(fee);

      return await this.feeRepository.findOneById(dbFee._id);
    } catch (err) {
      throw new HttpException(
        {
          code: ErrorCode.FeeCreationError,
          message: err.message || 'Fee cannot be created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    { skip, limit }: PaginationOptions,
    params: GetFeeRequestDto | null = null,
  ): Promise<{
    fees: LeanDocument<FeeDocument>[];
    total: number;
  }> {
    return this.feeRepository.findAll({ skip, limit }, params);
  }

  async findOneById(id: string): Promise<LeanDocument<FeeDocument>> {
    try {
      return await this.feeRepository.findOneById(id);
    } catch {
      return null;
    }
  }

  async findOneByMemberMonthYear(
    param: GetFeeMemberDto,
  ): Promise<LeanDocument<FeeDocument>> {
    try {
      return await this.feeRepository.findOneByMemberMonthYear(param);
    } catch {
      return null;
    }
  }
}
