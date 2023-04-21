import { PartialType } from "@nestjs/swagger";
import { CreateMerchantDto } from "src/merchants/dto/CreateMerchant.dto";


export class RegisterMerchantDto extends PartialType(CreateMerchantDto) {}