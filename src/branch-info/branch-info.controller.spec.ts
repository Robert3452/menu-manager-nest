import { Test, TestingModule } from '@nestjs/testing';
import { BranchInfoController } from './branch-info.controller';
import { BranchInfoService } from './branch-info.service';

describe('BranchInfoController', () => {
  let controller: BranchInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchInfoController],
      providers: [BranchInfoService],
    }).compile();

    controller = module.get<BranchInfoController>(BranchInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
