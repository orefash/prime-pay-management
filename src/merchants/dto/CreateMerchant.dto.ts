import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, isNotEmpty, IsNotEmptyObject, IsNumber, isNumber, IsOptional, IsString, length, Length, MinLength, ValidateNested } from "class-validator";
import { CreateBankDto } from "./CreateBankDetails.dto";

export class CreateMerchantDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    promoterFname: string;

    @IsString()
    @IsNotEmpty()
    promoterLname: string;

    @IsString()
    @Length(10)
    @IsOptional()
    bvn: string;

    @IsString()
    @IsOptional()
    businessType: string;

    @IsBoolean()
    @IsNotEmpty()
    isRegistered: boolean;

    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @MinLength(3)
    password: string;

    @IsNumber()
    @IsOptional()
    avgMonthlySales: number;

    
    @IsNotEmpty()
    @IsString()
    @Length(10)
    accountNo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    bankCode: string;

}