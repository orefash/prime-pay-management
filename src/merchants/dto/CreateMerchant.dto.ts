import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length, MinLength } from "class-validator";
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
    @IsNotEmpty()
    businessType: string;

    @IsUrl()
    @IsOptional()
    websiteUrl: string;

    @IsString()
    @IsOptional()
    cacUrl: string;

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

    @IsNumber()
    @IsOptional()
    systemId: number;

    
    @IsNotEmpty()
    @IsString()
    @Length(10)
    accountNo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    bankCode: string;

    @IsNotEmpty()
    @IsString()
    bankName: string;

    @IsNumber()
    @IsNotEmpty()
    streetNo: number;

    @IsNotEmpty()
    @IsString()
    street: string;

    @IsOptional()
    @IsString()
    landmark: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    lga: string;

    @IsNotEmpty()
    @IsString()
    country: string;
}