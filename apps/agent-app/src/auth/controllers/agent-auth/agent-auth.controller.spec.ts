// import { Test, TestingModule } from '@nestjs/testing';
// import { AgentAuthController } from './agent-auth.controller';

// describe('AgentAuthController', () => {
//   let controller: AgentAuthController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AgentAuthController],
//     }).compile();

//     controller = module.get<AgentAuthController>(AgentAuthController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

// import { Test, TestingModule } from '@nestjs/testing';
// import { AgentAuthController } from './agent-auth.controller';
// import { AgentAuthService } from '../../services/agent-auth/agent-auth.service';
// import { AuthGuard } from '@nestjs/passport';
// import RequestWithAgent from '../../types/requestWithAgent.interface';
// import { Response } from 'express';

// describe('AgentAuthController', () => {
//   let agentAuthController: AgentAuthController;
//   let agentAuthService: AgentAuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AgentAuthController],
//       providers: [
//         {
//           provide: 'AGENT_AUTH_SERVICE',
//           useClass: AgentAuthService, // Provide a mock or use the actual service
//         },
//       ],
//     }).compile();

//     agentAuthService = module.get<AgentAuthService>(AgentAuthService);
//     agentAuthController = module.get<AgentAuthController>(AgentAuthController);
//   });

//   describe('login', () => {
//     it('should return agent and token', async () => {
//       // Arrange
//       const mockRequest = {
//         user: { id: 1, username: 'testuser' } as RequestWithAgent,
//       };
//       const mockResponse = {
//         send: jest.fn(),
//       } as unknown as Response;
//       jest.spyOn(agentAuthService, 'getJwtToken').mockReturnValue('mockToken');

//       // Act
//       await agentAuthController.login(mockRequest, mockResponse);

//       // Assert
//       expect(mockResponse.send).toHaveBeenCalledWith({
//         agent: { id: 1, username: 'testuser' }, // Modify this based on your user structure
//         token: 'mockToken',
//       });
//     });
//   });
// });
