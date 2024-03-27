import { MerchantCustomer } from "@app/db-lib/models/MerchantCustomer";
import { Agent } from "./Agent";
import { ResetToken } from "./ResetToken";
import { MerchantTransaction } from "@app/db-lib/models/MerchantTransaction";
import { AgentPayout } from "./AgentPayout";
import { AdminUser } from "@app/db-lib/models/Admin";


const entities = [ Agent, ResetToken, MerchantCustomer, MerchantTransaction, AgentPayout, AdminUser ]

export { Agent, ResetToken, MerchantCustomer, MerchantTransaction, AgentPayout, AdminUser };
export default entities;
