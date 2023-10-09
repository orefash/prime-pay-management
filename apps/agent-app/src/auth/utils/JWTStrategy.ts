
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../types/tokenPayload.interface';
import { AgentsService } from '../../agents/services/agents/agents.service';
// import { MerchantsService } from '../../merchants/services/merchants/merchants.service';
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    // @Inject('MERCHANTS_SERVICE') 
    @Inject(AgentsService)
    private readonly agentService: AgentsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }
 
  async validate(payload: TokenPayload) {

    return this.agentService.getAgentByField("id", payload.uid);
  }
}