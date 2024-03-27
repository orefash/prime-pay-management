import { Test, TestingModule } from '@nestjs/testing';
import { MerchantProductService } from './merchant-product.service';

describe('MerchantProductService', () => {
  let service: MerchantProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantProductService],
    }).compile();

    service = module.get<MerchantProductService>(MerchantProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
