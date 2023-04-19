import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";


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