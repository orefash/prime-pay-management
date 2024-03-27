import { Test, TestingModule } from '@nestjs/testing';
import { PrimepayController } from './primepay.controller';

describe('PrimepayController', () => {
  let controller: PrimepayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrimepayController],
    }).compile();

    controller = module.get<PrimepayController>(PrimepayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
