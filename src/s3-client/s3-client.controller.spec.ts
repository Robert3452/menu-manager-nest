import { Test, TestingModule } from '@nestjs/testing';
import { S3ClientController } from './s3-client.controller';
import { S3ClientService } from './s3-client.service';

describe('S3ClientController', () => {
  let controller: S3ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3ClientController],
      providers: [S3ClientService],
    }).compile();

    controller = module.get<S3ClientController>(S3ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
