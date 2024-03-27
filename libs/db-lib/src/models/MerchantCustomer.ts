import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { MerchantTransaction } from "./MerchantTransaction";


@Entity()
@Unique(['phone'])
export class MerchantCustomer {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

    @Column({
        nullable: false,
        default: ''
    })
    name: string;

    @Column({
        length: 11,
        nullable: false,
        default: ''
    })
    phone: string;

    @Column({
        nullable: true,
    })
    email: string;

    @Column({
        nullable: true,
    })
    ippis: string;

    @Column({
        nullable: false,
        default: false
    })
    isTest: boolean;

    @CreateDateColumn({
        nullable: false,
    })
    orderDate: Date;


    @OneToMany( type => MerchantTransaction , transaction => transaction.customer)
    transactions: MerchantTransaction[];
    
}