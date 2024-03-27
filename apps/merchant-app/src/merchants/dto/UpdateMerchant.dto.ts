
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Address } from "../../types/address.interface";
import { Socials } from "../../types/socials.interface";

export class EditMerchantDto {

    @IsString()
    @IsNotEmpty()
    promoterFname: string;

    @IsString()
    @IsNotEmpty()
    promoterLname: string;

    @IsNumberString()
    @Length(11)
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