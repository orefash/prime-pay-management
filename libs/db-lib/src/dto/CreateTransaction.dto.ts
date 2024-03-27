import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, MinLength } from "class-validator";


export enum TransactionStatus {
    PENDING = 'Pending',
    DELIVERED = 'Delivered',
    CONFIRMED = 'Confirmed'
}

export enum TransactionType {
    INSTANT_LOAN = 'Instant Loan',
    EXTENDED_LOAN = 'Extended Loan',
    PAY_MERCHANT = 'Pay Merchant'
}

export enum OrderChannel {
    WEB = 'Web',
    FACEBOOK = 'Facebook',
    WHATSAPP = 'Whatsapp',
    INSTAGRAM = 'Instagram',
    USSD = 'USSD'
}

export class CreateTransactionDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsEnum(TransactionStatus)
    @IsOptional()
    status: TransactionStatus;

    @IsString()
    @IsEnum(TransactionType)
    @IsOptional()
    transactionType?: string;

    @IsString()
    @IsEnum(OrderChannel)
    @IsNotEmpty()
    orderChannel: OrderChannel;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    isTest: boolean;

    @IsString()
    @IsOptional()
    channel_id: string;

    @IsString()
    @IsNotEmpty()
    ippis: string;

    @IsString()
    @IsNotEmpty()
    mid: string;

    @IsNumber()
    @IsOptional()
    loanTenor: number;

    @IsString()
    @IsOptional()
    refCode: string;

    @IsString()
    @IsOptional()
    agentCode: string;

    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    // @MinLength(10)
    @IsNotEmpty()
    customerPhone: string;

    @IsString()
    // @IsEm(10)
    @IsOptional()
    customerEmail: string;

}