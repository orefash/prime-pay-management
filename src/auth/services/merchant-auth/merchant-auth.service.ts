import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestPasswordResetDto } from 'src/auth/dto/RequestPasswordReset.dto';
import { ResetPasswordDto } from 'src/auth/dto/ResetPassword.dto';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant, ResetToken } from 'src/typeorm';
import { comparePasswords, encodePassword, generateToken } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

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
        private readonly configService: ConfigService
    ) { }

    public getCookieWithJwtToken(merchantId: string) {
        const payload: TokenPayload = { merchantId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    async validateMerchant(email: string, password: string) {
        const merchant: Merchant = await this.merchantService.getMerchantByEmail(email);
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

        const newToken = this.tokenRepository.create({ token: tokenHash, merchant });
        const createdToken = await this.tokenRepository.save(newToken);

        // console.log('New token: ', createdToken);

        return {
            token: resetToken,
            mid: merchant.id,
        };
    }


    async resetPassword(resetPassword: ResetPasswordDto) {

        let token = await this.tokenRepository.findOne({
            where: { merchant: { id: resetPassword.mid } }
        });

        if (!token) {
            throw new Error("Invalid or expired password reset token");
        }

        console.log("token: ", token)
        console.log("rp: ", resetPassword)


        const isValid = await comparePasswords(resetPassword.token, token.token);
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

        if(updatedMerchant){
            
            await this.tokenRepository.delete(token.id);
            return {
                message: "Password updated successfully",
                success: true
            };
        }

        throw new Error("Password update failed");

    }

}
