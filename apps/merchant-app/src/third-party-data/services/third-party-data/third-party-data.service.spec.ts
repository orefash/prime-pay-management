import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyDataService } from './third-party-data.service';

describe('ThirdPartyDataService', () => {
  let service: ThirdPartyDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ HttpModule ],
      providers: [ThirdPartyDataService],
    }).compile();

    service = module.get<ThirdPartyDataService>(ThirdPartyDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
