import { Test, TestingModule } from '@nestjs/testing';
import { MerchantAuthService } from './merchant-auth.service';

describe('MerchantAuthService', () => {
  let service: MerchantAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantAuthService],
    }).compile();

    service = module.get<MerchantAuthService>(MerchantAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
