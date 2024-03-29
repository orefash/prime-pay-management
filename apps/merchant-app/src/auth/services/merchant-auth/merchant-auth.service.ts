import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { RequestPasswordResetDto } from '../../dto/RequestPasswordReset.dto';
import { ResetPasswordDto } from '../../dto/ResetPassword.dto';
import { ConfirmEmail } from '../../../mail/types/confirm_email.type';
import { MerchantsService } from '../../../merchants/services/merchants/merchants.service';
import { Merchant, ResetToken } from '../../../typeorm';
import { comparePasswords, encodePassword, generateToken } from '../../../utils/bcrypt';
import { Repository } from 'typeorm';
import { TokenPayload } from '../../types/tokenPayload.interface';

@Injectable()
export class MerchantAuthService {
    constructor(
        @InjectRepository(ResetToken)
        private readonly tokenRepository: Repository<ResetToken>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
        @Inject(MerchantsService)
        private readonly merchantService: MerchantsService,
        @Inject(JwtService)
        private readonly jwtService: JwtService,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @InjectQueue('send_mail')
        private readonly mailQueue: Queue,
    ) { }

    public getCookieWithJwtToken(merchantId: string) {
        const payload: TokenPayload = { merchantId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getJwtToken(merchantId: string) {
        const payload: TokenPayload = { merchantId };
        const token = this.jwtService.sign(payload);

        // console.log("dcd: ", this.jwtService.decode(token))
        return token;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    async validateMerchant(email: string, password: string) {
        const merchant: Merchant = await this.merchantService.getMerchantByEmail(email);
        // console.log('in ver merhcant: ', merchant)
        if (merchant && comparePasswords(password, merchant.password)) {
            const { password, ...result } = merchant;
            return result;
        }
        return null;
    }

    async requestPasswordReset(requestPasswordReset: RequestPasswordResetDto) {

        const merchant: Merchant = await this.merchantService.getMerchantByEmail(requestPasswordReset.email);

        if (!merchant)
            throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);

        let token = await this.tokenRepository.findOne({
            where: { merchant: { id: merchant.id } }
        });

        // console.log('Token: ', token)

        if (token) {
            await this.tokenRepository.delete(token.id);
        }

        let resetToken = generateToken();
        let tokenHash = encodePassword(resetToken);

        const newToken = this.tokenRepository.create({ token: resetToken, merchant });
        const createdToken = await this.tokenRepository.save(newToken);

        // console.log('New token: ', createdToken);

        const isLocal = this.configService.get<number>('IS_LOCAL');
        let bUrl = "";
        if (isLocal == 1) {
            bUrl = this.configService.get<string>('BASE_URL_UAT')
        } else {
            bUrl = this.configService.get<string>('BASE_URL_LIVE')
        }

        bUrl = `${bUrl}/request-password-reset/${resetToken}/${merchant.id}`
       

        let resetPasswordData: ConfirmEmail = {
            name: merchant.name,
            email: merchant.email,
            redirect_url: bUrl
        }

        // console.log("CDATA: ", confirmEmailData)

        try {
            console.log("In email confirmation send")
            const job = await this.mailQueue.add('reset_password', resetPasswordData);

            return {
                status: "Successful Request",
                success: true,
            };
        } catch (error) {
            console.log("Error in email confirmation send")
        }

    }


    async resetPassword(resetPassword: ResetPasswordDto) {

        let token = await this.tokenRepository.findOne({
            where: { merchant: { id: resetPassword.mid } }
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

        await this.merchantRepository.update(resetPassword.mid, {
            password: passwordHash
        });

        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: resetPassword.mid
            }
        });

        if (updatedMerchant) {

            await this.tokenRepository.delete(token.id);
            return {
                message: "Password updated successfully",
                success: true
            };
        }

        throw new Error("Password update failed");

    }


    async confirmEmail(token: string) {

        let merchantToken = await this.tokenRepository.findOne({
            where: { token: token },
            relations: ['merchant'],
        });

        if (!merchantToken)
            throw new Error("Token is Invalid")

        // console.log("MID: ", merchantToken)

    
        await this.merchantRepository.update(merchantToken.merchant.id, {
            isConfirmed: true
        });

        const isLocal = this.configService.get<number>('IS_LOCAL');

        let bUrl = "";
        if(isLocal == 1){
            bUrl = this.configService.get<string>('BASE_URL_UAT')
        }else{
            bUrl = this.configService.get<string>('BASE_URL_LIVE')
        }

        await this.tokenRepository.delete(merchantToken.id);

        return {
            status: true,
            redirectUrl: bUrl
        };
    }

}
