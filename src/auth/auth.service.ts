import { JwtService } from '@nestjs/jwt';
import { UserSingUp, UserLogin } from './../user/interface/user';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errCode, failCode, successCode } from 'src/config/response';
import { ConfigService } from '@nestjs/config';

interface authLogin {
  user_id: number
  email: String
  password: String
  full_name: String
  age: Number
  avatar: String
  accessToken?: String
}
@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService,
    private config: ConfigService) { }

  prisma = new PrismaClient()
  async login(user: UserLogin, res: any) {
    try {
      let checkUser = await this.prisma.user.findFirst({
        where: {
          email: user.email
        }
      })

      if (checkUser) {
        if (checkUser.password === user.password) {
          const token = this.jwtService.sign({ data: checkUser }, { secret: this.config.get("SECRET_KEY"), expiresIn: "30m" })
          let data: authLogin = checkUser
          data.accessToken = token

          successCode(res, data, "Đăng nhập thành công")
        } else {
          errCode(res, user, "Sai mật khẩu")
        }
      } else {
        errCode(res, user, "Sai email")

      }
    } catch (error) {
      failCode(res, "Lỗi Be")
    }

  }

  async signUp(user: UserSingUp, res: any) {

    try {
      let checkUser = await this.prisma.user.findFirst({
        where: {
          email: user.email
        }
      })

      if (checkUser) {
        errCode(res, user, "Email đã tồn tại")

      } else {
        await this.prisma.user.create({ data: user })
        successCode(res, user, "Đăng ký thành công")
      }
    } catch (error) {
      failCode(res, "Lỗi Be")
    }



  }
}
