import { MerchantKey } from "./Keys";
import { Merchant } from "./Merchant";
import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantProduct } from "./MerchantProducts";
import { MerchantTransaction } from "./MerchantTransaction";
import { ResetToken } from "./ResetToken";

const entities = [Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey, MerchantProduct]

export { Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey, MerchantProduct };
export default entities;
