import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AgentAuthService } from "../services/agent-auth/agent-auth.service";
// import { MerchantAuthService } from "../services/merchant-auth/merchant-auth.service";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'agent-local') {
    constructor(
        @Inject('AGENT_AUTH_SERVICE') private readonly authService: AgentAuthService,
    ) {
        super(
            {
                usernameField: 'email',
            }
        );
    }

    async validate(email: string, password: string): Promise<any> {

        try {

            const agent = await this.authService.validateAgent(email, password);

            if (!agent) {
                // throw new UnauthorizedException();
                throw new HttpException("Incorrect Email or Password", HttpStatus.UNAUTHORIZED);
            }

            return agent;

        } catch (error) {
            throw new HttpException("Incorrect Email or Password", HttpStatus.UNAUTHORIZED);

        }

    }

}