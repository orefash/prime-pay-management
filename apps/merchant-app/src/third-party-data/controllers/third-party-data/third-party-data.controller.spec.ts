import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyDataController } from './third-party-data.controller';

describe('ThirdPartyDataController', () => {
  let controller: ThirdPartyDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdPartyDataController],
    }).compile();

    controller = module.get<ThirdPartyDataController>(ThirdPartyDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
