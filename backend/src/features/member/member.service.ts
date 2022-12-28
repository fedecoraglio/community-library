import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { ErrorCode } from '../../core/errors/error-code';
import { MemberRepository } from './member.repository';
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { MemberDocument } from './member.schema';
import { UpdateMemberRequestDto } from './dtos/update-member-request.dto';
import { GetMemberRequestDto } from './dtos/get-member-request.dto';

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

  async findOneAndUpdate(
    id: string,
    member: UpdateMemberRequestDto,
  ): Promise<LeanDocument<MemberDocument>> {
    try {
      return this.memberRepository.findOneAndUpdate(id, member);
    } catch {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a member with this ID",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAll(
    { skip, limit }: PaginationOptions,
    params: GetMemberRequestDto | null = null,
  ): Promise<{
    members: LeanDocument<MemberDocument>[];
    total: number;
  }> {
    return this.memberRepository.findAll({ skip, limit }, params);
  }

  async findOneById(id: string): Promise<LeanDocument<MemberDocument>> {
    try {
      return await this.memberRepository.findOneById(id);
    } catch {
      return null;
    }
  }
}
