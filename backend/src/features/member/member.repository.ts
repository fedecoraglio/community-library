import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { Member, MemberDocument } from './member.schema';

@Injectable()
export class MemberRepository {
  private readonly logger = new Logger(MemberRepository.name);
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async create(
    member: CreateMemberRequestDto,
  ): Promise<LeanDocument<MemberDocument>> {
    return (
      await new this.memberModel({
        ...member,
        uid: new Date().getTime(),
      }).save()
    ).toObject();
  }

  async findAll(
    filter: any,
    { skip, limit }: PaginationOptions,
  ): Promise<{
    members: LeanDocument<MemberDocument>[];
    total: number;
  }> {
    const users = await this.memberModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.memberModel.find(filter).count().exec();

    return {
      members: users.map((member) => member.toObject()),
      total,
    };
  }

  async findOneById(id: string): Promise<LeanDocument<MemberDocument>> {
    try {
      return (await this.memberModel.findById(id).exec()).toObject();
    } catch (err) {
      this.logger.error(err.message);
      return null;
    }
  }
}
