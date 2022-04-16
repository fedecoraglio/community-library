import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { hash } from 'bcrypt';

import { GetUsersRequestDto } from './dtos/get-users-request.dto';
import { UserRepository } from './user.repository';
import { PaginationOptions } from '../../core/pagination-options/pagination-options';
import { ErrorCode } from '../../core/errors/error-code';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly usersRepository: UserRepository,
  ) {}

  async create(
    user: CreateUserRequestDto,
  ): Promise<LeanDocument<UserDocument>> {
    if (user.email && (await this.findOneByEmail(user.email))) {
      throw new HttpException(
        {
          code: ErrorCode.UserAlreadyExist,
          message: 'Ya existe un usuario con ese mail',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    user = {
      ...user,
      email: user.email?.toLowerCase() || user.email,
      password: await hash(user.password, 10),
    };

    const dbUser = await this.usersRepository.create(user);

    return this.usersRepository.findOneById(dbUser._id);
  }

  async findAll(
    params: GetUsersRequestDto,
    { skip, limit }: PaginationOptions,
  ): Promise<{
    users: LeanDocument<UserDocument>[];
    total: number;
  }> {
    return this.usersRepository.findAll(null, { skip, limit });
  }

  async findOneById(id: string): Promise<LeanDocument<UserDocument>> {
    try {
      const user: any = await this.usersRepository.findOneById(id);

      return { ...user };
    } catch {
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<LeanDocument<UserDocument>> {
    try {
      return this.usersRepository.findOneByEmail(email);
    } catch {
      return null;
    }
  }

  async findOneAndUpdate(
    id: string,
    user: UpdateUserRequestDto,
  ): Promise<LeanDocument<UserDocument>> {
    if (user.password) {
      user = {
        ...user,
        password: await hash(user.password, 10),
      };
    }

    try {
      return this.usersRepository.findOneAndUpdate(id, user);
    } catch {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a user with this ID",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: string) {
    try {
      await this.usersRepository.delete(id);
    } catch {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a user with this ID",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserPermissions(id: string): Promise<string[]> {
    const { permissions } = await this.userModel.findById(id);

    return permissions;
  }

  async isUserActive(id: string): Promise<boolean> {
    const user = await this.usersRepository.findOneById(id);

    return !!user;
  }
}
