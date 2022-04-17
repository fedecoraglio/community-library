import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeeController } from './fee.controller';
import { FeeRepository } from './fee.repository';

import { Fee, feeSchema } from './fee.schema';
import { FeeService } from './fee.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Fee.name,
        schema: feeSchema,
      },
    ]),
  ],
  controllers: [FeeController],
  providers: [FeeService, FeeRepository],
  exports: [FeeService],
})
export class FeeModule {}
