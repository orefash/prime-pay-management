import { Test, TestingModule } from '@nestjs/testing';
import { PrimepayService } from './primepay.service';

describe('PrimepayService', () => {
  let service: PrimepayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrimepayService],
    }).compile();

    service = module.get<PrimepayService>(PrimepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
