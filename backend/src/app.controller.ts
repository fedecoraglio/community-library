import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from './core/public';
import { getEnumValues } from './core/utils/get-enum-values';
import { isProduction } from './core/utils/is-production';
import { LoginRequestDto, LoginResponseDto } from './features/auth/auth.dtos';
import { AuthService } from './features/auth/auth.service';
import { Permission } from './features/user/permissions/permission';
import { UserService } from './features/user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    if (!isProduction()) {
      this.setUpDefaultUser();
    }
  }

  @Public()
  @Post('/login')
  login(
    @Body() { email, password }: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(email, password);
  }

  private async setUpDefaultUser() {
    const defaultUserEmail = 'admin@admin.com';
    const defaultUser = await this.userService.findOneByEmail(defaultUserEmail);

    if (defaultUser) {
      return;
    }

    // give all the permissions to the main user
    await this.userService.create({
      name: 'Federico Coraglio',
      email: defaultUserEmail,
      password: '12345678',
      permissions: getEnumValues(Permission),
    });
  }
}
