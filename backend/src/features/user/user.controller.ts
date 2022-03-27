import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ErrorCode } from '../../core/errors/error-code';
import {
  Pagination,
  PaginationOptions,
} from '../../core/pagination-options/pagination-options';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { GetUsersRequestDto } from './dtos/get-users-request.dto';
import { GetUsersResponseDto } from './dtos/get-users-response.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { UserDto } from './dtos/user.dto';
import { PassportRequest } from './permissions/passport-request';
import { UserService } from './user.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  //@HasPermissions(Permission.ViewUsers, Permission.ViewAdmins)
  async findAll(
    @Query() query: GetUsersRequestDto,
    @Pagination() paginationOptions: PaginationOptions,
  ): Promise<GetUsersResponseDto> {
    const dbData = await this.userService.findAll(query, paginationOptions);

    return {
      users: instanceToPlain(dbData.users.map((user) => new UserDto(user))),
      total: dbData.total,
    } as GetUsersResponseDto;
  }

  @Post()
  //@HasPermissions(Permission.EditAdmins, Permission.EditUsers)
  async create(@Body() user: CreateUserRequestDto): Promise<UserDto> {
    const dbUser = await this.userService.create(user);

    return new UserDto(dbUser);
  }

  @Put('/:id')
  //@HasPermissions(Permission.ViewAdmins, Permission.ViewUsers)
  async findOneAndUpdate(
    @Param('id') id: string,
    @Body() user: UpdateUserRequestDto,
  ): Promise<UserDto> {
    return new UserDto(await this.userService.findOneAndUpdate(id, user));
  }

  @Get('/me')
  async findCurrent(@Req() request: PassportRequest) {
    const { user } = request;
    const dbUser = await this.userService.findOneById(user.id);

    if (!dbUser) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a user with this ID ",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return new UserDto(dbUser);
  }

  @Get('/:id')
  //@HasPermissions(Permission.ViewUsers, Permission.ViewAdmins)
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const dbUser = await this.userService.findOneById(id);

    if (!dbUser) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a user with this ID ",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return new UserDto(dbUser);
  }
}
