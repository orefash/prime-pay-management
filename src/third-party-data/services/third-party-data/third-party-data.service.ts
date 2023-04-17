import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';

@Injectable()
export class ThirdPartyDataService {
    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) { }

    async getBankList() {
        return this.http
            .post(
                'https://prime-pay.africa/cba/webservices/merch.php',  
                {
                    "vser":[
                        {
                            "merchID":"vendor",
                            "key":"NT9YkqNCZOlUlXcW8YNyenUhw6kd9Zl5W6xEUB02zEQ",
                            "reqType":"get_bank"
                        }
                    ]
                }
            )
            .pipe(
                map((res) => res.data?.bpi),
                map((bpi) => bpi?.USD),
                map((usd) => {
                    return usd?.rate;
                }),
            )
            .pipe(
                catchError(() => {
                    throw new ForbiddenException('API not available');
                }),
            );
    }

}
