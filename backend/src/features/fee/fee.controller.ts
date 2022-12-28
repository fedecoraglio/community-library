import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { ErrorCode } from '../../core/errors/error-code';
import {
  Pagination,
  PaginationOptions,
} from '../../core/pagination-options/pagination-options';
import { CreateFeeRequestDto } from './dtos/create-fee-request.dto';
import { FeeDto } from './dtos/fee.dto';
import { GetFeeRequestDto } from './dtos/get-fee-request.dto';
import { GetFeeResponseDto } from './dtos/get-fee-response.dto';
import { FeeService } from './fee.service';

@Controller('/fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get()
  async findAll(
    @Pagination() paginationOptions: PaginationOptions,
    @Query() params: GetFeeRequestDto | null,
  ): Promise<GetFeeResponseDto> {
    const dbData = await this.feeService.findAll(paginationOptions, params);

    return {
      fees: instanceToPlain(dbData.fees.map((fee) => new FeeDto(fee))),
      total: dbData.total,
    } as GetFeeResponseDto;
  }

  @Post()
  async create(@Body() fee: CreateFeeRequestDto): Promise<FeeDto> {
    return new FeeDto(await this.feeService.create(fee));
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<FeeDto> {
    const fee = await this.feeService.findOneById(id);

    if (!fee) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a fee with this ID ",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return new FeeDto(fee);
  }
}
