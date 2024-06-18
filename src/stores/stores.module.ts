import { Module } from '@nestjs/common';
import { S3ClientModule } from 'src/s3-client/s3-client.module';
import { BranchesController } from './controllers/branches.controller';
import { StoreController } from './controllers/stores.controller';
import { BranchesService } from './services/branches.service';
import { StoresService } from './services/stores.service';
import { StoreHasUsersService } from './services/store-has-user.service';
@Module({
  imports: [S3ClientModule],
  providers: [StoresService, BranchesService, StoreHasUsersService],
  exports: [StoresService, BranchesService],
  controllers: [StoreController, BranchesController],
})
export class StoresModule {}
