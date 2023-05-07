import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, user } from '@prisma/client'
import {  UpdateUser} from './interface/user';
import { errCode, failCode, successCode } from '../config/response';

@Injectable()
export class UserService {

   prisma = new PrismaClient()

  async getUser(id: string): Promise<user> {
    try {
      const checkUser = await this.prisma.user.findFirst({
        where: {
          user_id: Number(id),
        }
      })

      if (!checkUser) throw new NotFoundException(`User with id ${id} not found.`);

      return checkUser
    } catch (error) {
      throw new Error(error.message)
    }

  }

  async saveAvatar(user_id: string, imgName: string) {
    let data = await this.prisma.user.findFirst({
      where: {
        user_id: Number(user_id),
      }
    });

    data.avatar = imgName;
    await this.prisma.user.update({
      data, where: {
        user_id: Number(user_id)
      }
    });

    return "Update thành công"

  }

  async updateUser(res: any, id: string, user: UpdateUser) {
    let checkUser = await this.prisma.user.findFirst({
      where: {
        user_id: Number(id),
      }
    })


    if (checkUser) {
      const { age, email, password, full_name } = user
      checkUser.email = email;
      checkUser.full_name = full_name;
      checkUser.age = age;
      checkUser.password = password;

      await this.prisma.user.update({
        data: checkUser, where: {
          user_id: Number(id)
        }
      });
      successCode(res, user, "Update user thanh cong")
    } else {
      errCode(res, user, "id user khong ton tai")
    }


  }

  async getAccountInformation(id: string) {
    try {
      const checkUser = await this.prisma.user.findFirst({
        where: {
          user_id: Number(id),
        }
      })

      if (!checkUser) throw new NotFoundException(`User with id ${id} not found.`);

      const information = this.prisma.save_image.findMany({
        where: {
          user_id: Number(id),
        },
        include: { image: true },
      })

      return information

    } catch (error) {
      throw new Error(error.message)
    }

  }

  async getImageList(id: string) {
    try {
      const checkUser = await this.prisma.user.findFirst({
        where: {
          user_id: Number(id),
        },
        include: { image: true },
      })

      if (!checkUser) throw new NotFoundException(`User with id ${id} not found.`);

      return checkUser
    } catch (error) {
      throw new Error(error.message)

    }
  }
}
