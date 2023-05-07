import { user } from '@prisma/client';
import { Body, Controller, Get, Param, Post, Put, Req, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { SaveImageDto, UpdateUser, UserLogin, UserSingUp } from './interface/user';
import { failCode } from '../config/response';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(AuthGuard("jwt"))
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private config: ConfigService,
    ) { }

    @Get("/get-user/:id")
    getUser(@Param("id") id : string): Promise<user> {
        return this.userService.getUser(id);
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: process.cwd() + "/public/avatar",
            filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
        })
    }))
    @Post("/update-avatar/:user_id")
    uploadAva(@Param("user_id") user_id, @UploadedFile() file: Express.Multer.File) {
        return this.userService.saveAvatar(user_id, file.filename);
    }

    @Put("/update-user/:id")
    updateUser(@Response() res: any, @Param("id") id: string, @Body() user: UpdateUser,) {
        return this.userService.updateUser(res, id, user)
    }

    @Get("/account-information/:id")
    getAccountInformation(@Param("id") id : string) {
        return this.userService.getAccountInformation(id);
    }

    @Get("/get-image-list/:id")
    getImageList(@Param("id") id : string){
        return this.userService.getImageList(id);
    }

}
