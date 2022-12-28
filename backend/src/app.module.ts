import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AuthService } from './features/auth/auth.service';
import { JwtAuthGuard } from './features/auth/jwt-auth-guard';
import { JwtStrategy } from './features/auth/jwt-strategy';
import { HasPermissionsGuard } from './features/user/permissions/has-permissions';
import { UserModule } from './features/user/user.module';
import { AuthValidateMiddleware } from './features/auth/auth-validate.middleware';
import { AppService } from './app.service';
import { MemberModule } from './features/member/member.module';
import { FeeModule } from './features/fee/fee.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';

console.log(`./env/${process.env.NODE_ENV}.env.json`);
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => require(`./env/${process.env.NODE_ENV}.env.json`)],
      cache: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db_uri'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: { expiresIn: configService.get<string>('jwt_expires') },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    MemberModule,
    FeeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: HasPermissionsGuard,
    },
    AuthService,
    AppService,
    JwtStrategy,
    TaskService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthValidateMiddleware).forRoutes('*');
  }
}
