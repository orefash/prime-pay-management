import { CreateTransactionDto } from "@app/db-lib/dto/CreateTransaction.dto";
import { PartialType } from "@nestjs/swagger";
// import { CreateTransactionDto } from "../../merchant-transaction/dto/CreateTransaction.dto";




export class PayMerchantDto extends PartialType(CreateTransactionDto) {}