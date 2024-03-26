
import { IsBoolean, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class UpdateBankDto {

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
    
    @IsBoolean() // Add validation for boolean type
    payoutPending: boolean = true;
    
}