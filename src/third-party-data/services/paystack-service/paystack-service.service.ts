import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TransferRecipient } from 'src/third-party-data/types/paystack-req.data';

@Injectable()
export class PaystackService {
    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) { }

    async validateBankAccount(accountNo: string, bankCode: string): Promise<boolean> {
        // Ensure the bankCode is a 3-character code (if it's longer).
        if (bankCode.length > 3) {
            bankCode = bankCode.slice(-3);
        }

        // Get the Paystack API key based on the environment (test or live).
        const PAYSTACK_ENV = this.configService.get<string>('PAYSTACK_ENV');
        const paystack_key =
            PAYSTACK_ENV === 'test'
                ? this.configService.get<string>('PAYSTACK_TEST_SKEY')
                : this.configService.get<string>('PAYSTACK_LIVE_SKEY');

        try {
            const payUrl = `https://api.paystack.co/bank/resolve?account_number=${accountNo}&bank_code=${bankCode}`;

            // Make the API call to Paystack and extract the data property from the response.
            const { data } = await lastValueFrom(
                this.http.get(payUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${paystack_key}`,
                    },
                })
            );

            // Check the status property in the data and return true if it's valid.
            return data.status;
        } catch (error) {
            // If there's an error during the API call, log the error and return false.
            // You can handle the error differently based on your use case.
            // console.error('Account validation error:', error.message);
            return false;
        }
    }


    async createTransferRecipient(name: string, accountNo: string, bankCode: string): Promise<TransferRecipient> {
        // Ensure the bankCode is a 3-character code (if it's longer).
        if (bankCode.length > 3) {
            bankCode = bankCode.slice(-3);
        }

        // Get the Paystack API key based on the environment (test or live).
        const PAYSTACK_ENV = this.configService.get<string>('PAYSTACK_ENV');
        const paystack_key =
            PAYSTACK_ENV === 'test'
                ? this.configService.get<string>('PAYSTACK_TEST_SKEY')
                : this.configService.get<string>('PAYSTACK_LIVE_SKEY');

        try {

            const isAccountValid = await this.validateBankAccount(accountNo, bankCode);

            if(!isAccountValid)
                throw new Error("Bank details are invalid");

            const payUrl = `https://api.paystack.co/transferrecipient`;

            const postData = {
                type: 'nuban',
                name,
                account_number: accountNo,
                bank_code: bankCode,
                currency: 'NGN',
            };

            // Make the API call to Paystack and extract the data property from the response.
            const { data } = await lastValueFrom(
                this.http.post(payUrl, postData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${paystack_key}`,
                    },
                })
            );

            let response_data: TransferRecipient = {
                status: data.status
            }
            if(data.status){
                response_data.recipient_code = data.data.recipient_code;
            }

            return response_data;
        } catch (error) {
            console.log("transferRecipient error: ", error.message)
           return {
                status: false
            };
        }
    }


    async initiatePaystackTransfer(name: string, accountNo: string, bankCode: string): Promise<TransferRecipient> {
        // Ensure the bankCode is a 3-character code (if it's longer).
        if (bankCode.length > 3) {
            bankCode = bankCode.slice(-3);
        }

        // Get the Paystack API key based on the environment (test or live).
        const PAYSTACK_ENV = this.configService.get<string>('PAYSTACK_ENV');
        const paystack_key =
            PAYSTACK_ENV === 'test'
                ? this.configService.get<string>('PAYSTACK_TEST_SKEY')
                : this.configService.get<string>('PAYSTACK_LIVE_SKEY');

        try {

            const isAccountValid = await this.validateBankAccount(accountNo, bankCode);

            if(!isAccountValid)
                throw new Error("Bank details are invalid");

            const payUrl = `https://api.paystack.co/transferrecipient`;

            const postData = {
                type: 'nuban',
                name,
                account_number: accountNo,
                bank_code: bankCode,
                currency: 'NGN',
            };

            // Make the API call to Paystack and extract the data property from the response.
            const { data } = await lastValueFrom(
                this.http.post(payUrl, postData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${paystack_key}`,
                    },
                })
            );

            let response_data: TransferRecipient = {
                status: data.status
            }
            if(data.status){
                response_data.recipient_code = data.data.recipient_code;
            }

            return response_data;
        } catch (error) {
            console.log("transferRecipient error: ", error.message)
           return {
                status: false
            };
        }
    }

}
