import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AccountService } from './account.service';

@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  constructor(
    private service: AccountService,
    private auth: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const account = await this.service.register(
      dto.email,
      dto.username,
      dto.password,
    );

    return this.auth.createSessionForAccount(account);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
