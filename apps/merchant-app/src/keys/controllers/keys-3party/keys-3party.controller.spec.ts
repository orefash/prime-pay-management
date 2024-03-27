import { Test, TestingModule } from '@nestjs/testing';
import { Keys3partyController } from './keys-3party.controller';

describe('Keys3partyController', () => {
  let controller: Keys3partyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Keys3partyController],
    }).compile();

    controller = module.get<Keys3partyController>(Keys3partyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
