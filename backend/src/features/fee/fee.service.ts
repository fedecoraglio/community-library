import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { ErrorCode } from '../../core/errors/error-code';
import { FeeRepository } from './fee.repository';
import { CreateFeeRequestDto } from './dtos/create-fee-request.dto';
import { FeeDocument } from './fee.schema';
import { GetFeeRequestDto } from './dtos/get-fee-request.dto';

@Injectable()
export class FeeService {
  constructor(private readonly feeRepository: FeeRepository) {}

  async create(fee: CreateFeeRequestDto): Promise<LeanDocument<FeeDocument>> {
    try {
      const dbFee = await this.feeRepository.create(fee);

      return this.feeRepository.findOneById(dbFee._id);
    } catch (error) {
      throw new HttpException(
        {
          code: ErrorCode.FeeCreationError,
          message: 'Fee cannot be created',
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
}
