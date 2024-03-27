import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PayoutChannels } from "../statics/PayoutChannels";



export enum PTransactionStatus {
    PENDING = 'Pending',
    FAILED = 'Failed',
    SUCCESS = 'Success',
    REVERSED = 'Reversed',
}


export class CreatePayoutDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsEnum(PTransactionStatus)
    @IsNotEmpty()
    status: PTransactionStatus;

    @IsString()
    @IsEnum(PayoutChannels)
    @IsNotEmpty()
    channel: PayoutChannels;

    @IsBoolean()
    @IsNotEmpty()
    isWithdraw: boolean;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsOptional()
    channelId?: string;

    @IsString()
    @IsNotEmpty()
    mid: number;

    // @IsNumber()
    // @IsOptional()
    // loanTenor: number;

    @IsString()
    @IsOptional()
    accountNo?: string;

}