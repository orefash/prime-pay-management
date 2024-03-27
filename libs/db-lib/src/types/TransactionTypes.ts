// import { MerchantTransaction } from "../../typeorm";

import { MerchantTransaction } from "../models/MerchantTransaction";


export interface FindTransactionData {
    data: MerchantTransaction[],
    totalPageNo: number
}