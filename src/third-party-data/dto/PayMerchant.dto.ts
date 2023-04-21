import { PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "src/merchant-transaction/dto/CreateTransaction.dto";




export class PayMerchantDto extends PartialType(CreateTransactionDto) {}