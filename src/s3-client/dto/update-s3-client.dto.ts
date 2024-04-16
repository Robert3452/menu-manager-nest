import { PartialType } from '@nestjs/mapped-types';
import { CreateS3ClientDto } from './create-s3-client.dto';

export class UpdateS3ClientDto extends PartialType(CreateS3ClientDto) {
  id: number;
}
