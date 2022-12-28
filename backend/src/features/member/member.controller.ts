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
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { ErrorCode } from '../../core/errors/error-code';
import {
  Pagination,
  PaginationOptions,
} from '../../core/pagination-options/pagination-options';
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { GetMemberRequestDto } from './dtos/get-member-request.dto';
import { GetMemberResponseDto } from './dtos/get-member-response.dto';
import { MemberDto } from './dtos/member.dto';
import { UpdateMemberRequestDto } from './dtos/update-member-request.dto';
import { MemberService } from './member.service';

@Controller('/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async findAll(
    @Pagination() paginationOptions: PaginationOptions,
    @Query() params: GetMemberRequestDto | null,
  ): Promise<GetMemberResponseDto> {
    const dbData = await this.memberService.findAll(paginationOptions, params);

    return {
      members: instanceToPlain(
        dbData.members.map((member) => new MemberDto(member)),
      ),
      total: dbData.total,
    } as GetMemberResponseDto;
  }

  @Post()
  async create(@Body() member: CreateMemberRequestDto): Promise<MemberDto> {
    const dbMember = await this.memberService.create(member);

    return new MemberDto(dbMember);
  }

  @Put('/:id')
  async findOneAndUpdate(
    @Param('id') id: string,
    @Body() member: UpdateMemberRequestDto,
  ): Promise<MemberDto> {
    return new MemberDto(await this.memberService.findOneAndUpdate(id, member));
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<MemberDto> {
    const member = await this.memberService.findOneById(id);

    if (!member) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a member with this ID ",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return new MemberDto(member);
  }
}
