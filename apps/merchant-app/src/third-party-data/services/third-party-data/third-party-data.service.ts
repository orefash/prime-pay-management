import { HttpService } from '@nestjs/axios';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { PayMerchantDto } from '../../dto/PayMerchant.dto';
import { RegisterMerchantDto } from '../../dto/RegisterMerchant.dto';

@Injectable()
export class ThirdPartyDataService {

    private ppay_url = process.env.PPAY_URL;
    private ppay_key = process.env.PPAY_KEY;


    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) {
        // console.log(`In 3d: ${this.ppay_url} && ${this.ppay_key}`)
     }


    async registerMerchant(registerMerchantDto: RegisterMerchantDto) {
        const { data } = await lastValueFrom(
            this.http
                .post(
                    this.ppay_url,
                    {
                        "vser": [
                            {
                                "merchID": "vendor",
                                "key": this.ppay_key,
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
                    this.ppay_url,
                    {
                        "vser": [
                            {
                                "merchID": "vendor",
                                "key": this.ppay_key,
                                "reqType": "book_ippis",
                                "ippis": payMerchantDto.ippis,
                                "amount": payMerchantDto.amount,
                                "tenor": payMerchantDto.loanTenor,
                                "vendor": payMerchantDto.mid,
                                "rfCode": payMerchantDto.refCode,
                                "Desc": payMerchantDto.description
                            }
                        ]
                    },
                    {
                        headers: {

                        }
                    }
                )
                .pipe(
                    catchError((error: AxiosError) => {
                        // this.logger.error(error.response.data);
                        throw 'Primepay Register Merchant Error';
                    }),
                )
        );

        // console.log("Pay Merhcant Prime: ", data)
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
                    this.ppay_url,
                    {
                        "vser": [
                            {
                                "merchID": "vendor",
                                "key": this.ppay_key,
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
