import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, MinLength } from "class-validator";


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
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    channel_id: string;

    @IsNumberString()
    @IsNotEmpty()
    ippis: number;

    @IsNumberString()
    @IsNotEmpty()
    mid: number;

    @IsNumber()
    @IsOptional()
    loanTenor: number;

    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    customerPhone: string;

}