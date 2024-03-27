import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class WithdrawPayoutDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number;


    // @IsString()
    // @IsNotEmpty()
    // mid: number;

    @IsBoolean()
    @IsNotEmpty()
    isTest: boolean;

}