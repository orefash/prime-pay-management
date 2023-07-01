// import { TransactionStatus } from "src/merchant-transaction/dto/CreateTransaction.dto";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Merchant } from "./Merchant";
import { PayoutChannels } from "src/merchant-payout/statics/PayoutChannels";
import { PTransactionStatus } from "src/merchant-payout/dto/CreatePayoutTransaction.dto";

@Entity()
export class MerchantPayout {

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

    @ManyToOne(type => Merchant, merchant => merchant.id)
    merchant: Merchant;
   
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