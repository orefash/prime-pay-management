import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import { CreateMerchantDto } from "src/merchants/dto/CreateMerchant.dto";


export class RegisterMerchantDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(10)
    accountNo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    bankCode: string;

}