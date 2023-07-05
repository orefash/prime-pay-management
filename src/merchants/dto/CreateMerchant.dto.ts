

import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl, Length, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IDTYPES } from "src/statics/types/IDTypes";
import SERVICETYPES from "src/statics/types/ServiceTypes";
import { Address } from "src/types/address.interface";


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
    @IsNotEmpty()
    @IsIn(SERVICETYPES)
    businessType: string;

    @IsBoolean()
    @IsNotEmpty()
    isRegistered: boolean;

    // @ValidateIf((object, value) => value.trim() !== '')
    @IsNumberString()
    @Length(11)
    @MaxLength(11)
    @MinLength(11)
    @IsOptional()
    bvn?: string;

    // @IsNotEmpty()
    // @IsString()
    // @IsIn(IDTYPES)
    // promoterIdType: string;

    // // @IsNotEmpty()
    // @IsString()
    // @IsOptional()
    // promoterId?: string;

    // @IsString()
    // @IsOptional()
    // promoterIdMime?:string;

    // @IsUrl()
    // @IsOptional()
    // websiteUrl: string;

    // @IsArray()
    // @IsString({ each: true })
    // @IsOptional()
    // cacDocs: string[];

    

    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @MinLength(3)
    password: string;

    // @IsOptional()
    // address: Address;
 
    // @IsNotEmpty()
    // @IsNumber()
    // streetNo: string;

    // @IsNotEmpty()
    // @IsString()
    // street: string;

    // @IsOptional()
    // @IsString()
    // landmark: string;

    // @IsNotEmpty()
    // @IsString()
    // state: string;

    // @IsNotEmpty()
    // @IsString()
    // lga: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    
    // @IsNumber()
    // @IsOptional()
    // avgMonthlySales: number;

    // @IsNumber()
    // @IsOptional()
    // systemId: number;


    @IsNotEmpty()
    @IsNumberString()
    @Length(10)
    accountNo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    bankCode: string;

    @IsNotEmpty()
    @IsString()
    bankName: string;

}