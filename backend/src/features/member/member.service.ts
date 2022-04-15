import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { ErrorCode } from '../../core/errors/error-code';
import { MemberRepository } from './member.repository';
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { MemberDocument } from './member.schema';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async create(
    member: CreateMemberRequestDto,
  ): Promise<LeanDocument<MemberDocument>> {
    try {
      const dbMember = await this.memberRepository.create(member);

      return this.memberRepository.findOneById(dbMember._id);
    } catch (error) {
      throw new HttpException(
        {
          code: ErrorCode.MemberCreationError,
          message: 'Member cannot be created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll({ skip, limit }: PaginationOptions): Promise<{
    members: LeanDocument<MemberDocument>[];
    total: number;
  }> {
    return this.memberRepository.findAll(null, { skip, limit });
  }

  async findOneById(id: string): Promise<LeanDocument<MemberDocument>> {
    try {
      return await this.memberRepository.findOneById(id);
    } catch {
      return null;
    }
  }
}
