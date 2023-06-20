import { TransactionStatus } from "src/merchant-transaction/dto/CreateTransaction.dto";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Merchant } from "./Merchant";

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
        default: TransactionStatus.PENDING
    })
    status: string;

    @Column({
        nullable: false,
        default: '₦'
    })
    currency: string;


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

    @Column({
        nullable: true,
    })
    loanTenor: number;


    @CreateDateColumn({
        nullable: false,
    })
    transactionDate: Date;


}