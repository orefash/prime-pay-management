
import { Agent } from '../../typeorm';
import { Request } from 'express';
// import { Merchant } from "/typeorm";

interface RequestWithAgent extends Request {
    user: Agent;
}
   
export default RequestWithAgent;