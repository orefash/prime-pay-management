
import { Request } from 'express';
import { Merchant } from "src/typeorm";

interface RequestWithMerchant extends Request {
    user: Merchant;
}
   
export default RequestWithMerchant;