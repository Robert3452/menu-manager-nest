import { Module } from '@nestjs/common';
import { StoresService } from './services/stores.service';
import { StoresController } from './stores.controller';
import { BranchesService } from './services/branches.service';
import { S3ClientService } from 'src/s3-client/s3-client.service';

@Module({
  imports: [S3ClientService],
  exports: [StoresService, BranchesService],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
