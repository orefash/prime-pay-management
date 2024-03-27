// import { MerchantCustomer } from "../../typeorm";

import { MerchantCustomer } from "../models/MerchantCustomer";


export interface FetchCustomerData {
    data: MerchantCustomer[],
    totalPageNo: number
}