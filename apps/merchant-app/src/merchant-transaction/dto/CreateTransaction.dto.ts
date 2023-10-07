import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, MinLength } from "class-validator";


export enum TransactionStatus {
    PENDING = 'Pending',
    DELIVERED = 'Delivered',
    CONFIRMED = 'Confirmed'
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

    @IsNumber()
    @IsNotEmpty()
    mid: number;

    @IsNumber()
    @IsOptional()
    loanTenor: number;

    @IsString()
    @IsOptional()
    refCode: string;

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