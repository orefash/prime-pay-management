
import { PTransactionStatus } from "@app/db-lib/dto/CreatePayoutTransaction.dto";
import { PayoutChannels } from "@app/db-lib/statics/PayoutChannels";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Agent } from "./Agent";


@Entity()
export class AgentPayout {

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
        nullable: false,
        default: true
    })
    isWithdraw: boolean;

    @Column({
        nullable: false,
        default: PTransactionStatus.PENDING
    })
    status: string;

    @Column({
        nullable: false,
        default: PayoutChannels.PAYSTACK
    })
    channel: string;

    @Column({
        nullable: false,
        default: '₦'
    })
    currency: string;


    @Column({
        nullable: true,
    })
    channelId: string;


    @Column({
        length: 10,
        nullable: true,
    })
    accountNo: string;

    @ManyToOne(type => Agent, agent => agent.id)
    agent: Agent;
   
    // @Column({
    //     nullable: false,
    // })
    // mid: number;

    // @Column({
    //     nullable: true,
    // })
    // loanTenor: number;


    @CreateDateColumn({
        nullable: false,
    })
    transactionDate: Date;


}