import { Module } from '@nestjs/common';
import { StoresService } from './services/stores.service';
import { BranchesService } from './services/branches.service';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { StoreController } from './controllers/stores.controller';
import { BranchesController } from './controllers/branches.controller';

@Module({
  imports: [S3ClientService],
  exports: [StoresService, BranchesService],
  controllers: [StoreController, BranchesController],
  providers: [StoresService],
})
export class StoresModule {}
