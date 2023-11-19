import { Test, TestingModule } from '@nestjs/testing';
import { PaystackLibService } from './paystack-lib.service';

describe('PaystackLibService', () => {
  let service: PaystackLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaystackLibService],
    }).compile();

    service = module.get<PaystackLibService>(PaystackLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
