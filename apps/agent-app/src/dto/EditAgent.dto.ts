
// import { Transform } from "class-transformer";
import { Address } from "@app/db-lib/types/address.interface";
import { IsArray, IsBoolean, IsBooleanString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl, Length, MaxLength, MinLength, ValidateIf } from "class-validator";

// import SERVICETYPES from "../../statics/types/ServiceTypes";



export class EditAgentDto {

    // @IsString()
    // @IsNotEmpty()
    // name: string;

    @IsString()
    @IsNotEmpty()
    agentFname: string;

    @IsString()
    @IsNotEmpty()
    agentLname: string;


    @IsString()
    @IsNotEmpty()
    // @IsIn(SERVICETYPES)
    marketSector: string;

    // @IsBoolean()
    // @IsNotEmpty()
    // isRegistered: boolean;

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



    // @IsEmail()
    // @IsNotEmpty()
    // email: string;


    @IsNotEmpty()
    @IsString()
    phone: string;

    // @IsNotEmpty()
    // @MinLength(3)
    // password: string;

    // @IsOptional()
    // address: Address;

    @IsNotEmpty()
    @IsNumber()
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


    // @IsNumber()
    // @IsOptional()
    // avgMonthlySales: number;

    // @IsNumber()
    // @IsOptional()
    // systemId: number;


    // @IsNotEmpty()
    // @IsNumberString()
    // @Length(10)
    // accountNo: string;

    // @IsNotEmpty()
    // @IsString()
    // @MinLength(2)
    // bankCode: string;

    // @IsOptional()
    // @IsString()
    // bankName: string;

    @IsNotEmpty()
    @IsString()
    stateOfOrigin: string;

    @IsOptional()
    address: Address;

}