import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";


export enum TransactionStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CONFIRMED = 'CONFIRMED'
}


export enum OrderChannel {
    WEB = 'WEB',
    FACEBOOK = 'FACEBOOK',
    WHATSAPP = 'WHATSAPP',
    INSTAGRAM = 'INSTAGRAM',
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
    @IsNotEmpty()
    ippis: string;

    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @Length(11)
    @IsNotEmpty()
    customerPhone: string;

}