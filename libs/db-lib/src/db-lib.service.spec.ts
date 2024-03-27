import { Test, TestingModule } from '@nestjs/testing';
import { DbLibService } from './db-lib.service';

describe('DbLibService', () => {
  let service: DbLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbLibService],
    }).compile();

    service = module.get<DbLibService>(DbLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
