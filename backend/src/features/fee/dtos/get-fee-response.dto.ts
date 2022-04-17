import { ApiProperty } from '@nestjs/swagger';
import { FeeDto } from './fee.dto';

export class GetFeeResponseDto {
  @ApiProperty({ type: FeeDto })
  fees: FeeDto[];
  @ApiProperty()
  total: number;
}
