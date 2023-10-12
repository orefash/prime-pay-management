import { MerchantTransaction } from "@app/db-lib/models/MerchantTransaction";
import { MerchantKey } from "./Keys";
import { Merchant } from "./Merchant";
// import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantPayout } from "./MerchantPayout";
import { MerchantProductImage } from "./MerchantProductImages";
import { MerchantProduct } from "./MerchantProducts";
import { ResetToken } from "./ResetToken";
import { MerchantCustomer } from "@app/db-lib/models/MerchantCustomer";

const entities = [Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey, MerchantProduct, MerchantProductImage, MerchantPayout]

export { Merchant, MerchantCustomer, MerchantTransaction, ResetToken, MerchantKey, MerchantProduct, MerchantProductImage, MerchantPayout };
export default entities;
