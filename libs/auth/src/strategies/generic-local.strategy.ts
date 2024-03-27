// shared-auth-lib/src/generic-local.strategy.ts
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class GenericLocalStrategy extends PassportStrategy(Strategy, 'generic-local') {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: any,
    ) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new HttpException("Incorrect Email or Password", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isConfirmed) {
            throw new HttpException("Email invalid, Please reset password", HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
