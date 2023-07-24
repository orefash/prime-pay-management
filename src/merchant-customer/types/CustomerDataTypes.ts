import { MerchantCustomer } from "src/typeorm";


export interface FetchCustomerData {
    data: MerchantCustomer[],
    totalPageNo: number
}