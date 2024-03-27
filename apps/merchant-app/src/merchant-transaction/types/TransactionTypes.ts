import { MerchantTransaction } from "../../typeorm";


export interface FindTransactionData {
    data: MerchantTransaction[],
    totalPageNo: number
}