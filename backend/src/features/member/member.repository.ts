import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';

import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { GetMemberRequestDto } from './dtos/get-member-request.dto';
import { MemberDto } from './dtos/member.dto';
import { UpdateMemberRequestDto } from './dtos/update-member-request.dto';
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

  async findOneAndUpdate(
    id: string,
    member: UpdateMemberRequestDto,
  ): Promise<LeanDocument<MemberDocument>> {
    const dbUser = await this.memberModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id) }, member as any, {
        new: false,
      })
      .exec();

    return dbUser.toObject();
  }

  async findAll(
    { skip, limit }: PaginationOptions,
    params: GetMemberRequestDto | null = null,
  ): Promise<{
    members: LeanDocument<MemberDocument>[];
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
    const members = await this.memberModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 })
      .exec();

    const total = await this.memberModel.count(filter).exec();
    return {
      members: members.map((member) => member.toObject()),
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
