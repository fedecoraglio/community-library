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
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { GetMemberResponseDto } from './dtos/get-member-response.dto';
import { MemberDto } from './dtos/member.dto';
import { MemberService } from './member.service';

@Controller('/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async findAll(
    @Pagination() paginationOptions: PaginationOptions,
  ): Promise<GetMemberResponseDto> {
    const dbData = await this.memberService.findAll(paginationOptions);

    return {
      members: instanceToPlain(
        dbData.members.map((user) => new MemberDto(user)),
      ),
      total: dbData.total,
    } as GetMemberResponseDto;
  }

  @Post()
  async create(@Body() member: CreateMemberRequestDto): Promise<MemberDto> {
    const dbMember = await this.memberService.create(member);

    return new MemberDto(dbMember);
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
