
import { IsNotEmpty, IsNumber, IsString, Length, MinLength } from "class-validator";

export class UpdateAgentCodeDto {
    
    @IsString()
    @IsNotEmpty()
    agentCode: string;
    
}