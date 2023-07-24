import { MerchantTransaction } from "src/typeorm";


export interface FindTransactionData {
    data: MerchantTransaction[],
    totalPageNo: number
}