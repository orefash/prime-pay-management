
// import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl, Length, MaxLength, MinLength, ValidateIf } from "class-validator";

// import SERVICETYPES from "../../statics/types/ServiceTypes";



export class CreateAgentDto {

    // @IsString()
    // @IsNotEmpty()
    // name: string;

    @IsString()
    @IsNotEmpty()
    agentFname: string;


    @IsString()
    @IsOptional()
    agentMname?: string;

    @IsString()
    @IsNotEmpty()
    agentLname: string;


    @IsString()
    @IsOptional()
    // @IsIn(SERVICETYPES)
    marketSector?: string;

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

    @IsOptional()
    @IsString()
    stateOfOrigin?: string;

    // @IsNotEmpty()
    // @IsString()
    // lga: string;

    @IsOptional()
    @IsString()
    country?: string;

    
    // @IsNumber()
    // @IsOptional()
    // avgMonthlySales: number;

    // @IsNumber()
    // @IsOptional()
    // systemId: number;


    @IsOptional()
    @IsNumberString()
    @Length(10)
    accountNo?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    bankCode?: string;

    @IsOptional()
    @IsString()
    bankName?: string;

}