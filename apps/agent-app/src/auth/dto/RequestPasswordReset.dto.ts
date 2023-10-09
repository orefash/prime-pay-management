import { IsNotEmpty, IsString } from "class-validator";


export class RequestPasswordResetDto {

    @IsString()
    @IsNotEmpty()
    email: string;

}