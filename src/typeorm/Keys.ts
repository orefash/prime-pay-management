import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { Merchant } from "./Merchant";


@Entity()
export class MerchantKey {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

   

    @Column({
        nullable: false,
    })
    live_public_key: string;

    @Column({
        nullable: false,
    })
    live_private_key: string;

    @OneToOne(() => Merchant)
    @JoinColumn()
    merchant: Merchant

    @CreateDateColumn({
        nullable: false,
    })
    orderDate: Date;

    @UpdateDateColumn({
        nullable: false,
    })
    modifiedDate: Date;

}