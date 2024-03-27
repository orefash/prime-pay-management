import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TransferRecipient, WithdrawResponse } from '../../types/paystack-req.data';

@Injectable()
export class PaystackService {
    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) { }


    async getPaystackBank(bankName: string): Promise<string> {

        // Get the Paystack API key based on the environment (test or live).
        const PAYSTACK_ENV = this.configService.get<string>('PAYSTACK_ENV');
        const paystack_key =
            PAYSTACK_ENV === 'test'
                ? this.configService.get<string>('PAYSTACK_TEST_SKEY')
                : this.configService.get<string>('PAYSTACK_LIVE_SKEY');

        try {
            const payUrl = `https://api.paystack.co/bank?currency=NGN`;

            // Make the API call to Paystack and extract the data property from the response.
            const { data } = await lastValueFrom(
                this.http.get(payUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${paystack_key}`,
                    },
                })
            );

            console.log("Data; ", data)

            // Check the status property in the data and return true if it's valid.
            return data.status;
        } catch (error) {

            // If there's an error during the API call, log the error and return false.
            // You can handle the error differently based on your use case.
            console.error('Bank list fetch error: ', error.message);
            return null;
        }


    }

    async getBankList(): Promise<any> {

        try {
            // Get the Paystack API key based on the environment (test or live).
            const PAYSTACK_ENV = this.configService.get<string>('PAYSTACK_ENV');
            const paystack_key =
                PAYSTACK_ENV === 'test'
                    ? this.configService.get<string>('PAYSTACK_TEST_SKEY')
                    : this.configService.get<string>('PAYSTACK_LIVE_SKEY');

            const getBankUrl = 'https://api.paystack.co/bank?currency=NGN';

            const { data } = await lastValueFrom(
                this.http.get(getBankUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${paystack_key}`,
                    },
                })
            );

            if(data.status){
                return data.data
            }else{
                throw new Error("Bank fetch error")
            }            

        } catch (error) {
            console.log("get bank error: ", error)
            return null;
        }
    }

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
            console.error('Account validation error: ', error.message);
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

            if (!isAccountValid)
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
            };

            if (data.status) {
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

    async initiatePaystackTransfer(
        amount: number,
        payRecipient: string,
        merchantName: string,
    ): Promise<WithdrawResponse> {
        // Get the Paystack API key based on the environment (test or live).
        const PAYSTACK_ENV = this.configService.get<string>('PAYSTACK_ENV');
        const paystack_key =
            PAYSTACK_ENV === 'test'
                ? this.configService.get<string>('PAYSTACK_TEST_SKEY')
                : this.configService.get<string>('PAYSTACK_LIVE_SKEY');

        

        try {
            const payUrl = `https://api.paystack.co/transfer`;

            const uuidRef = uuidv4();

            const postData = {
                source: 'balance',
                amount,
                reference: uuidRef,
                recipient: payRecipient,
                reason: `Withdrawal for ${merchantName}`,
            };

            // Create the response data object.
            const responseData: WithdrawResponse = {
                status: false,
            };

            // Make the API call to Paystack and extract the data property from the response.
            const { data } = await lastValueFrom(
                this.http.post(payUrl, postData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${paystack_key}`,
                    },
                }),
            );

            responseData.status = data.status;
            if (data.status) {
                responseData.withdraw_status = data.data.status;
            }

            return responseData;
        } catch (error) {
            // Handle specific errors if needed.
            console.error('Initiate Paystack Transfer Error:', error.message);
            return {
                status: false,
            };
        }
    }

}
