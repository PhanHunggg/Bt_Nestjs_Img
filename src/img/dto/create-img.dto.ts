export class CreateImageDto {
  image_name: string;
  image_url: string;
  descr: string;
  user_id: string;
  image: Express.Multer.File;
}

export class findImageDto {
  name: string;
}

export class CreateCommentDto {
  user_id: number;
  comment: string;
}