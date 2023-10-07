
import { IsNotEmpty, IsNumber, IsString, Length, MinLength } from "class-validator";

export class UpdateMerchantMIDDto {
    
    @IsNumber()
    @IsNotEmpty()
    systemId: number;
    
}