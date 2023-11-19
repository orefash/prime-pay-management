import { MerchantCustomer } from "@app/db-lib/models/MerchantCustomer";
import { Agent } from "./Agent";
import { ResetToken } from "./ResetToken";
import { MerchantTransaction } from "@app/db-lib/models/MerchantTransaction";
import { AgentPayout } from "./AgentPayout";


const entities = [ Agent, ResetToken, MerchantCustomer, MerchantTransaction, AgentPayout ]

export { Agent, ResetToken, MerchantCustomer, MerchantTransaction, AgentPayout };
export default entities;
