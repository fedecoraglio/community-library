import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { Member, memberSchema } from './member.schema';
import { MemberService } from './member.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: memberSchema,
      },
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
})
export class MemberModule {}
