import { Test, TestingModule } from '@nestjs/testing';
import { AgentAuthService } from './agent-auth.service';

describe('AgentAuthService', () => {
  let service: AgentAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentAuthService],
    }).compile();

    service = module.get<AgentAuthService>(AgentAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
