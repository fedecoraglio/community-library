import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CreateFeeRequestDto } from './features/fee/dtos/create-fee-request.dto';
import { FeeStatus } from './features/fee/fee-status.enum';
import { FeeService } from './features/fee/fee.service';
import { MemberService } from './features/member/member.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly memberService: MemberService,
    private readonly feeService: FeeService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async generateFeeCurrentMonth() {
    this.logger.debug('Calling generateFeeCurrentMonth method');
    const resp = await this.memberService.findAll(
      { skip: 0, limit: 20_000 },
      { active: true },
    );
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    for (let member of resp.members) {
      try {
        const fee = await this.feeService.findOneByMemberMonthYear({
          memberId: member._id,
          month,
          year,
        });
        if (!fee) {
          const feeDto = new CreateFeeRequestDto();
          feeDto.feeNumber = month;
          feeDto.month = month;
          feeDto.year = year;
          feeDto.status = FeeStatus.Pending;
          feeDto.member = member._id;
          await this.feeService.create(feeDto);
        }
      } catch (err) {
        this.logger.error(`Error creating fee. Msg: ${JSON.stringify(err)}`);
        this.logger.error(
          `Error creating fee to ${member.name} - Id: ${member._id}`,
        );
      }
    }
  }
}
