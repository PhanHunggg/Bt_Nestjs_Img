import { PartialType } from '@nestjs/mapped-types';
import { CreateImageDto } from './create-img.dto';

export class UpdateImgDto extends PartialType(CreateImageDto) {}
