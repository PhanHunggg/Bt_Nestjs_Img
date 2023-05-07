import { errCode, failCode } from './../config/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, CreateImageDto, findImageDto } from './dto/create-img.dto';
import { PrismaClient } from '@prisma/client';
import { successCode } from 'src/config/response';
import { SaveImageDto } from 'src/user/interface/user';
import { ImageInterface } from './interface/image';

@Injectable()
export class ImgService {

  prisma = new PrismaClient()

  async createImg(createImageDto: CreateImageDto, res: any) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: Number(createImageDto.user_id)
        }
      });
      if (!user) {
        throw new NotFoundException(`User with id ${createImageDto.user_id} not found.`);
      }
      await this.prisma.image.create({
        data: {
          image_name: createImageDto.image_name,
          image_url: createImageDto.image_url,
          descr: createImageDto.descr,
          user_id: Number(createImageDto.user_id)
        }
      });
      successCode(res, createImageDto, "Xử lí thành công")
    } catch (error) {
      failCode(res, error.message)
    }
  }

  async getImage() {
    try {
      return await this.prisma.image.findMany()

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findImage(key: findImageDto) {

    try {
      const checkImage = await this.prisma.image.findMany({
        where: {
          image_name: key.name,
        }
      })

      if (!checkImage) throw new NotFoundException(`Image with name ${key} not found.`);

      return checkImage
    } catch (error) {
      throw new Error(error.message)
    }

  }

  async getImageDetail(id: string) {
    try {
      const checkImage = await this.prisma.image.findFirst({
        where: {
          image_id: Number(id),
        },
        include: { user: true }
      })
      if (!checkImage) throw new NotFoundException(`Image with id ${id} not found.`);

      return checkImage
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async createComment(res: any, comment: CreateCommentDto, id: string) {

    try {
      const checkImage = await this.prisma.image.findFirst({
        where: {
          image_id: Number(id),
        }
      })

      const checkUser = await this.prisma.user.findFirst({
        where: {
          user_id: comment.user_id,
        }
      })

      if (!checkImage) throw new NotFoundException(`Image with id ${id} not found.`);
      if (!checkUser) throw new NotFoundException(`User with id ${comment.user_id} not found.`);

      const data = {
        user_id: comment.user_id,
        image_id: Number(id),
        comment_date: new Date(),
        content: comment.comment
      }

      await this.prisma.comment.create({ data })

      successCode(res, data, "Thêm bình luận thành công")
    } catch (error) {
      throw new Error(error.message)
    }

  }

  async getCommentDetail(id: string) {
    try {
      const checkImage = await this.prisma.image.findFirst({
        where: {
          image_id: Number(id),
        },
        include: { comment: true }
      })

      if (!checkImage) throw new NotFoundException(`Image with id ${id} not found.`);

      return checkImage
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async saveImage(res, data: SaveImageDto) {
    const checkImage = await this.prisma.image.findFirst({
      where: {
        image_id: data.image_id,
      }
    })

    const checkUser = await this.prisma.user.findFirst({
      where: {
        user_id: data.user_id,
      }
    })

    if (!checkImage) throw new NotFoundException(`Image with id ${data.image_id} not found.`);
    if (!checkUser) throw new NotFoundException(`User with id ${data.user_id} not found.`);

    const newData = {
      user_id: data.user_id,
      image_id: data.image_id,
      save_date: new Date()
    }

    await this.prisma.save_image.create({ data: newData });
    successCode(res, newData, "Lưu ảnh thành công");
  }

  async getImageSave(res: any, userId: string, imgId: string) {
    const checkImg = await this.prisma.save_image.findFirst({
      where: {
        image_id: Number(imgId),
        user_id: Number(userId)
      }
    })

    if (checkImg) {
      successCode(res, checkImg, "Image đã lưu")
    } else errCode(res, imgId, "Image chưa lưu")

  }
  async deleteImage(res: any, body: ImageInterface) {
    const checkImage = await this.prisma.image.findFirst({
      where: {
        image_id: body.image_id
      }
    })

    if (!checkImage) throw new NotFoundException(`Image with id ${body.image_id} not found.`);

    const checkUser = await this.prisma.comment.findMany({
      where: {
        image_id: body.image_id
      }
    })

    if (checkUser) {
      for (let i = 0; i < checkUser.length; i++) {
        await this.prisma.comment.deleteMany({
          where: {
            comment_id: checkUser[i].comment_id
          }
        })
      }

    }


    const checkImageSave = await this.prisma.save_image.findFirst({
      where: {
        user_id: body.user_id,
        image_id: body.image_id
      }
    })

    if (checkImage) {
      await this.prisma.save_image.delete({
        where: {
          save_id: checkImageSave.save_id
        }
      })
    }

    await this.prisma.image.delete({
      where: {
        image_id: body.image_id
      }
    })


    res.send("Xóa hình ảnh thành công")
  }

}
