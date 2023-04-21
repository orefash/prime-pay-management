import { Merchant } from "./Merchant";
import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantTransaction } from "./MerchantTransaction";
import { ResetToken } from "./ResetToken";

const entities = [Merchant, MerchantCustomer, MerchantTransaction, ResetToken]

export { Merchant, MerchantCustomer, MerchantTransaction, ResetToken };
export default entities;
