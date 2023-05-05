
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Address } from "src/types/address.interface";
import { Socials } from "src/types/socials.interface";

export class EditMerchantDto {

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


    @IsBoolean()
    @IsNotEmpty()
    isRegistered: boolean;


    // @IsEmail()
    // @IsNotEmpty()
    // email: string;


    @IsNotEmpty()
    @IsString()
    phone: string;


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


    @IsOptional()
    @IsString()
    instagram: string;

    @IsOptional()
    @IsString()
    twitter: string;

    @IsOptional()
    @IsString()
    facebook: string;

    @IsOptional()
    socials: Socials;

    @IsOptional()
    address: Address;

}