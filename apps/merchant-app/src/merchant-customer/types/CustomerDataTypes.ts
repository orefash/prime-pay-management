import { MerchantCustomer } from "../../typeorm";


export interface FetchCustomerData {
    data: MerchantCustomer[],
    totalPageNo: number
}