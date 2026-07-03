import { Body, Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { RegisterDto } from './dto/register.dto';

@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  constructor(private service: AccountService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto.email, dto.username, dto.password);
  }
}
