
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Merchant } from "./Merchant";
import { MerchantCustomer } from "./MerchantCustomer";
import { TransactionStatus, TransactionType } from "../dto/CreateTransaction.dto";
import { Merchant } from "apps/agent-app/src/typeorm";

@Entity()
export class MerchantTransaction {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
        name: 'amount',
        type: 'decimal', 
        precision: 10, 
        scale: 2
    })
    amount: number;

    @Column({
        nullable: true,
        name: 'agent_fee',
        type: 'decimal', 
        precision: 10, 
        scale: 2
    })
    agent_fee: number;

    @Column({
        nullable: false,
        default: TransactionStatus.PENDING
    })
    status: string;

    @Column({
        nullable: false,
        default: TransactionType.PAY_MERCHANT
    })
    transactionType: string;

    @Column({
        nullable: false,
        default: 'NGN'
    })
    currency: string;

    @Column({
        nullable: true,
    })
    merchantReference: string;

    @Column({
        nullable: true,
    })
    agentCode: string;

    @Column({
        nullable: false,
        default: true
    })
    isTest: boolean;

    @Column({
        nullable: true,
    })
    orderChannel: string;

    @Column({
        nullable: true,
    })
    channel_id: string;

    @Column({
        nullable: true,
    })
    description: string;

    @ManyToOne(type => Merchant, merchant => merchant.transactions, { nullable: true })
    // merchant: Merchant;
    // @Column({
    //     nullable: true,
    // })
    merchant: Merchant;


    @ManyToOne(type => MerchantCustomer, customer => customer.transactions)
    customer: MerchantCustomer;

    // @Column({
    //     nullable: true,
    // })
    // merchantId: string;


    @Column({
        nullable: true,
    })
    loanTenor: number;

    

    @CreateDateColumn({
        nullable: false,
    })
    orderDate: Date;


}