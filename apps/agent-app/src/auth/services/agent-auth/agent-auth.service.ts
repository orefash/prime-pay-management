import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from '../../../typeorm/ResetToken';
import { Repository } from 'typeorm';
import { Agent } from '../../../typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RequestPasswordResetDto } from '../../dto/RequestPasswordReset.dto';
import { comparePasswords, encodePassword, generateToken } from '@app/utils/utils/bcrypt';
import { ConfirmEmail } from '@app/db-lib/types/confirm_email.type';
import { ResetPasswordDto } from '../../dto/ResetPassword.dto';
import { TokenPayload } from '../../types/tokenPayload.interface';
import { AgentsService } from 'apps/agent-app/src/agents/services/agents/agents.service';

@Injectable()
export class AgentAuthService {
    constructor(
        @InjectRepository(ResetToken)
        private readonly tokenRepository: Repository<ResetToken>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        @Inject(AgentsService)
        private readonly agentService: AgentsService,
        @Inject(JwtService)
        private readonly jwtService: JwtService,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @InjectQueue('send_mail')
        private readonly mailQueue: Queue,
    ) { }


    public getCookieWithJwtToken(uid: string) {
        const payload: TokenPayload = { uid };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getJwtToken(uid: string) {
        const payload: TokenPayload = { uid };
        const token = this.jwtService.sign(payload);

        // console.log("dcd: ", this.jwtService.decode(token))
        return token;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    async validateAgent(email: string, password: string) {
        const agent: Agent = await this.agentService.getAgentByField("email", email);
        console.log('in ver agent: ', agent)
        if (agent && comparePasswords(password, agent.password)) {
            const { password, ...result } = agent;
            return result;
        }
        return null;
    }

    async requestPasswordReset(requestPasswordReset: RequestPasswordResetDto) {

        const agent: Agent = await this.agentService.getAgentByField("email", requestPasswordReset.email);

        if (!agent)
            throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);

        let token = await this.tokenRepository.findOne({
            where: { agent: { id: agent.id } }
        });

        // console.log('Token: ', token)

        if (token) {
            await this.tokenRepository.delete(token.id);
        }

        let resetToken = generateToken();
        let tokenHash = encodePassword(resetToken);

        const newToken = this.tokenRepository.create({ token: resetToken, agent });
        const createdToken = await this.tokenRepository.save(newToken);

        // console.log('New token: ', createdToken);

        const isLocal = this.configService.get<number>('IS_LOCAL');
        let bUrl = "";
        if (isLocal == 1) {
            bUrl = this.configService.get<string>('BASE_AGENT_URL_UAT')
        } else {
            bUrl = this.configService.get<string>('BASE_AGENT_URL_LIVE')
        }

        bUrl = `${bUrl}/request-password-reset/${resetToken}/${agent.id}`
       

        let resetPasswordData: ConfirmEmail = {
            name: agent.agentFname,
            email: agent.email,
            redirect_url: bUrl
        }

        console.log("CDATA: ", resetPasswordData)

        try {
            console.log("In email req pass send")
            const job = await this.mailQueue.add('reset_password', resetPasswordData);

            return {
                status: "Successful Request",
                success: true,
            };
        } catch (error) {
            console.log("Error in reset password email send")
        }

    }


    async resetPassword(resetPassword: ResetPasswordDto) {

        let token = await this.tokenRepository.findOne({
            where: { agent: { id: resetPassword.mid } }
        });

        if (!token) {
            throw new Error("Invalid or expired password reset token");
        }

        // console.log("token: ", token)
        // console.log("rp: ", resetPassword)


        // const isValid = await comparePasswords(resetPassword.token, token.token);
        const isValid = resetPassword.token === token.token ? true : false;
        if (!isValid) {
            throw new Error("Invalid or expired password reset token");
        }

        const passwordHash = encodePassword(resetPassword.password);

        await this.agentRepository.update(resetPassword.mid, {
            password: passwordHash
        });

        const updatedAgent = await this.agentRepository.findOne({
            where: {
                id: resetPassword.mid
            }
        });

        if (updatedAgent) {

            await this.tokenRepository.delete(token.id);
            return {
                message: "Password updated successfully",
                success: true
            };
        }

        throw new Error("Password update failed");

    }


    async confirmEmail(token: string) {

        let agentToken = await this.tokenRepository.findOne({
            where: { token: token },
            relations: ['agent'],
        });

        if (!agentToken)
            throw new Error("Token is Invalid")

        // console.log("MID: ", merchantToken)

    
        await this.agentRepository.update(agentToken.agent.id, {
            isConfirmed: true
        });

        const isLocal = this.configService.get<number>('IS_LOCAL');

        let bUrl = "";
        if(isLocal == 1){
            bUrl = this.configService.get<string>('BASE_URL_UAT')
        }else{
            bUrl = this.configService.get<string>('BASE_URL_LIVE')
        }

        await this.tokenRepository.delete(agentToken.id);

        return {
            status: true,
            redirectUrl: bUrl
        };
    }

}
