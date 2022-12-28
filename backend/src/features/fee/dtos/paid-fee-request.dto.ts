import { ApiProperty } from '@nestjs/swagger';

export class PaidFeeRequestDto {
  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  feeId: string;
}
