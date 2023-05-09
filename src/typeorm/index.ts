import { MerchantKey } from "./Keys";
import { Merchant } from "./Merchant";
import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantTransaction } from "./MerchantTransaction";
import { ResetToken } from "./ResetToken";

const entities = [Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey]

export { Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey };
export default entities;
