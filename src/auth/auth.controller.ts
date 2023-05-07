import { UserSingUp } from './../user/interface/user';
import { Controller, Get, Post, Body, Patch, Param, Delete, Response } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserLogin } from 'src/user/interface/user';
import { failCode } from 'src/config/response';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private config: ConfigService,
  ) { }


  @Post("/login")
  login(@Body() body: UserLogin, @Response() res: any) {
    try {
      return this.authService.login(body, res);
    } catch (error) {
      failCode(res, "Lỗi Be")

    }
  }

  @Post("/sign-up")
  singUp(@Body() body: UserSingUp, @Response() res: any) {
    try {
      return this.authService.signUp(body, res);
    } catch (error) {
      failCode(res, "Lỗi Be")

    }
  }


}
