
import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class UpdateMerchantBankDto {

    @IsNotEmpty()
    @IsString()
    @Length(10)
    accountNo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    bankCode: string;

    @IsString()
    @IsNotEmpty()
    bankName: string;
    
}