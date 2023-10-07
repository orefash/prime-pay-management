
import { Request } from 'express';
import { Merchant } from '../../typeorm';
// import { Merchant } from "/typeorm";

interface RequestWithMerchant extends Request {
    user: Merchant;
}
   
export default RequestWithMerchant;