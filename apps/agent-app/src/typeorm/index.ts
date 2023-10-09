import { MerchantCustomer } from "@app/db-lib/models/MerchantCustomer";
import { Agent } from "./Agent";
import { ResetToken } from "./ResetToken";
import { MerchantTransaction } from "@app/db-lib/models/MerchantTransaction";


const entities = [ Agent, ResetToken, MerchantCustomer, MerchantTransaction ]

export { Agent, ResetToken, MerchantCustomer, MerchantTransaction };
export default entities;
