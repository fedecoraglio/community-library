import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
