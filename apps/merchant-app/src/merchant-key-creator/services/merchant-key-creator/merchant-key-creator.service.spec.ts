import { Test, TestingModule } from '@nestjs/testing';
import { MerchantKeyCreatorService } from './merchant-key-creator.service';

describe('MerchantKeyCreatorService', () => {
  let service: MerchantKeyCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantKeyCreatorService],
    }).compile();

    service = module.get<MerchantKeyCreatorService>(MerchantKeyCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
