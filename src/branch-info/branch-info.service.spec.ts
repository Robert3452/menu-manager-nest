import { Test, TestingModule } from '@nestjs/testing';
import { BranchInfoService } from './branch-info.service';

describe('BranchInfoService', () => {
  let service: BranchInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchInfoService],
    }).compile();

    service = module.get<BranchInfoService>(BranchInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
