import { ApiProperty } from '@nestjs/swagger';
import { MemberDto } from './member.dto';

export class GetMemberResponseDto {
  @ApiProperty({ type: MemberDto })
  members: MemberDto[];
  @ApiProperty()
  total: number;
}
