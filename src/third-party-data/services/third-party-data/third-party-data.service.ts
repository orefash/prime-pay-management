import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class ThirdPartyDataService {
    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) { }

    async getBankList() {
        const bankResponse = await lastValueFrom(
            this.http
            .post(
                'https://prime-pay.africa/cba/webservices/merch.php',
                {
                    "vser": [
                        {
                            "merchID": "vendor",
                            "key": "NT9YkqNCZOlUlXcW8YNyenUhw6kd9Zl5W6xEUB02zEQ",
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
