import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';

import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { UserDto } from './dtos/user.dto';
import { PaginationOptions } from '../../core/pagination-options/pagination-options';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    user: CreateUserRequestDto,
  ): Promise<LeanDocument<UserDocument>> {
    return (await new this.userModel(user).save()).toObject();
  }

  async findAll(
    filter: any,
    { skip, limit }: PaginationOptions,
  ): Promise<{
    users: LeanDocument<UserDocument>[];
    total: number;
  }> {
    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.userModel.find(filter).count().exec();

    return {
      users: users.map((user) => user.toObject()),
      total,
    };
  }

  async findOneById(id: string): Promise<LeanDocument<UserDocument>> {
    try {
      return (await this.userModel.findById(id).exec()).toObject();
    } catch {
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<LeanDocument<UserDocument>> {
    try {
      return (
        await this.userModel.findOne({ email: email.toLowerCase() }).exec()
      ).toObject();
    } catch {
      return null;
    }
  }

  async findOneAndUpdate(
    id: string,
    user: UpdateUserRequestDto &
      Pick<UserDto, 'reset_password_token' | 'reset_password_token_expire'>,
  ): Promise<LeanDocument<UserDocument>> {
    const dbUser = await this.userModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id) }, user as any, {
        new: true,
      })
      .exec();

    return dbUser.toObject();
  }

  async delete(id: string) {
    await this.userModel.findByIdAndRemove(id);
  }

  async isUserActive(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id);

    return !!user;
  }
}
