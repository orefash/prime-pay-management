import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBankDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    accountNo: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(3)
    bankCode: string;

}