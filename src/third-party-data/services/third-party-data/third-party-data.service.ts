import { HttpService } from '@nestjs/axios';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { PayMerchantDto } from 'src/third-party-data/dto/PayMerchant.dto';
import { RegisterMerchantDto } from 'src/third-party-data/dto/RegisterMerchant.dto';

@Injectable()
export class ThirdPartyDataService {
    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) { }


    async registerMerchant(registerMerchantDto: RegisterMerchantDto) {
        const { data } = await lastValueFrom(
            this.http
                .post(
                    'https://prime-pay.africa/cba/webservices/merch.php',
                    {
                        "vser": [
                            {
                                "merchID": "vendor",
                                "key": "QduC2*54Wx2MXJVUKLIy4)D*yZ$h6TTjA#6vMzBB%)(4Bm4mX#*dfyY@qT",
                                "reqType": "reg_merch",
                                "Name": registerMerchantDto.name,
                                "acctNo": registerMerchantDto.accountNo,
                                "bankCode": registerMerchantDto.bankCode
                            }
                        ]
                    }
                )
                .pipe(
                    catchError((error: AxiosError) => {
                        // this.logger.error(error.response.data);
                        throw 'Primepay Register Merchant Error';
                    }),
                )
        );

        console.log('in reg merchant: ', data)

        if (data.Desc == "Merchant Registered" && data.Merchant_ID)
            return data.Merchant_ID;


        throw new BadRequestException(data.Desc);
    }


    async payMerchant(payMerchantDto: PayMerchantDto) {
        const { data } = await lastValueFrom(
            this.http
                .post(
                    'https://prime-pay.africa/cba/webservices/merch.php',
                    {
                        "vser": [
                            {
                                "merchID": "vendor",
                                "key": "QduC2*54Wx2MXJVUKLIy4)D*yZ$h6TTjA#6vMzBB%)(4Bm4mX#*dfyY@qT",
                                "reqType": "book_ippis",
                                "ippis": payMerchantDto.ippis,
                                "amount": payMerchantDto.amount,
                                "tenor": payMerchantDto.loanTenor,
                                "vendor": payMerchantDto.mid,
                                "rfCode": payMerchantDto.refCode,
                                "Desc": payMerchantDto.description
                            }
                        ]
                    }
                )
                .pipe(
                    catchError((error: AxiosError) => {
                        // this.logger.error(error.response.data);
                        throw 'Primepay Register Merchant Error';
                    }),
                )
        );

        console.log("Pay Merhcant Prime: ", data)
        if(data.Desc == "Successful" && data.Stat && data.Stat[0].Response){
            let response = data.Stat[0].Response.split('|')[0];
            if(response == '01')
                return false
            return true
        }

        throw new BadRequestException('Pay Merchant error');
    }

    async getBankList() {
        const bankResponse = await lastValueFrom(
            this.http
                .post(
                    'https://prime-pay.africa/cba/webservices/merch.php',
                    {
                        "vser": [
                            {
                                "merchID": "vendor",
                                "key": "QduC2*54Wx2MXJVUKLIy4)D*yZ$h6TTjA#6vMzBB%)(4Bm4mX#*dfyY@qT",
                                "reqType": "get_bank"
                            }
                        ]
                    }
                )
                .pipe(
                    map((res) => res.data?.Stat),
                    map((stat) => {
                        return stat;
                    }),
                )
                .pipe(
                    catchError(() => {
                        throw new ForbiddenException('API not available');
                    }),
                )
        );

        // console.log(bankResponse)
        return bankResponse;
    }

}
