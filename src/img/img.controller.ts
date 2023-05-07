import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Response, UseGuards, Query } from '@nestjs/common';
import { ImgService } from './img.service';
import { CreateCommentDto, CreateImageDto, findImageDto } from './dto/create-img.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SaveImageDto } from 'src/user/interface/user';
import { ImageInterface } from './interface/image';
import { AuthGuard } from '@nestjs/passport';
import { failCode } from 'src/config/response';

@UseGuards(AuthGuard("jwt"))
@Controller('img')
export class ImgController {
  constructor(private readonly imgService: ImgService) { }

  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  @Post("/create-image")
  async createImage(@Body() createImageDto: CreateImageDto, @Response() res: any) {
    try {
      return this.imgService.createImg(createImageDto, res);
    } catch (error) {
      failCode(res, error.message)
    }
  }

  @Post("/create-comment/:id")
  async createComment(@Response() res: any, @Body() createCommentDto: CreateCommentDto, @Param("id") id: string) {
    return this.imgService.createComment(res, createCommentDto, id);
  }


  @Get("/get-image")
  async getImage() {
    try {
      return this.imgService.getImage();

    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get("/find-image")
  async findImage(@Body() body: findImageDto) {
    return this.imgService.findImage(body);
  }

  @Get("/get-image-detail/:id")
  async getImageDetail(@Param("id") id: string) {
    return this.imgService.getImageDetail(id)
  }

  @Get("/get-comment-detail/:id")
  async getCommentDetail(@Param("id") id: string) {
    return this.imgService.getCommentDetail(id)
  }

  @Post("/save-image")
  saveImage(@Response() res: any, @Body() body: SaveImageDto) {
    return this.imgService.saveImage(res, body)
  }

  @Delete("/delete-image")
  deleteImage(@Response() res: any, @Body() body: ImageInterface) {
    return this.imgService.deleteImage(res, body)
  }

  @Get("/get-img-save")
  getImageSave(@Response() res: any, @Query('userId') userId: string, @Query('imgId') imgId: string) {
    return this.imgService.getImageSave(res, userId, imgId)
  }
}
