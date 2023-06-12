import { MerchantKey } from "./Keys";
import { Merchant } from "./Merchant";
import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantProductImage } from "./MerchantProductImages";
import { MerchantProduct } from "./MerchantProducts";
import { MerchantTransaction } from "./MerchantTransaction";
import { ResetToken } from "./ResetToken";

const entities = [Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey, MerchantProduct, MerchantProductImage]

export { Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey, MerchantProduct, MerchantProductImage };
export default entities;
