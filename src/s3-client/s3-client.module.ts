import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { S3ClientService } from './s3-client.service';

@Global()
@Module({
  providers: [S3ClientService],
  exports: [S3ClientService],
  imports: [HttpModule],
})
export class S3ClientModule {}
