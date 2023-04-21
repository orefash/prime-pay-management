import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Merchant } from "./Merchant";
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
    ippis: number;

    @OneToMany( type => MerchantTransaction , transaction => transaction.mid)
    transactions: MerchantTransaction[];
    
}