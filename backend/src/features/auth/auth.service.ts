import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

import { LoginResponseDto, RefreshTokenResponseDto } from './auth.dtos';
import { ErrorCode } from '../../core/errors/error-code';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const dbUser = await this.userService.findOneByEmail(email);

    if (!dbUser) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: 'User with this email does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordsMatch = await compare(password, dbUser.password);

    if (!isPasswordsMatch) {
      throw new HttpException(
        {
          code: ErrorCode.PasswordsNotMatch,
          message: 'Email and password does not match',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const sub = omit(
      dbUser,
      '_id',
      'password',
      'reset_password',
      'reset_password_token_expire',
    );

    return {
      access_token: this.jwtService.sign({
        sub: dbUser._id,
        ...sub,
      }),
      user: new UserDto(dbUser),
    };
  }

  async refreshToken(accessToken: string): Promise<RefreshTokenResponseDto> {
    const decodedToken = this.jwtService.decode(accessToken) as any;

    if (
      !decodedToken.hasOwnProperty('exp') ||
      !decodedToken.hasOwnProperty('sub')
    ) {
      throw new HttpException(
        {
          code: ErrorCode.AccessTokenNotValid,
          message: 'access token is not valid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { sub: userId, exp } = decodedToken;
    const date = new Date(0);

    date.setUTCSeconds(exp);

    if (date.valueOf() < new Date().valueOf()) {
      throw new HttpException(
        {
          code: ErrorCode.AccessTokenExpired,
          message: 'access token expired',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const dbUser = await this.userService.findOneById(userId);

    if (!dbUser) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a user with this ID",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { _id: id, ...rest } = dbUser;

    // Update token expiration date
    return {
      access_token: this.jwtService.sign({
        sub: id,
        ...rest,
      }),
      user: new UserDto(dbUser),
    };
  }

  async isUserActive(token: string): Promise<boolean> {
    let isUserActive = false;

    try {
      const accessToken = token.replace('Bearer ', '');
      const userData: any = this.jwtService.decode(accessToken);

      isUserActive = await this.userService.isUserActive(userData.sub);
    } catch (err) {
      console.error(err);
    }

    return isUserActive;
  }
}
