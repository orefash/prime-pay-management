import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
