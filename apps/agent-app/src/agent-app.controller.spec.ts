import { Test, TestingModule } from '@nestjs/testing';
import { AgentAppController } from './agent-app.controller';
import { AgentAppService } from './agent-app.service';

describe('AgentAppController', () => {
  let agentAppController: AgentAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AgentAppController],
      providers: [AgentAppService],
    }).compile();

    agentAppController = app.get<AgentAppController>(AgentAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(agentAppController.getHello()).toBe('Hello World!');
    });
  });
});
