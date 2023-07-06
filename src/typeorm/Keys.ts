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
        unique: true 
    })
    live_public_key: string;

    @Column({
        nullable: false,
        unique: true 
    })
    live_private_key: string;

    @Column({
        nullable: false,
        default: false
    })
    isLiveActive: boolean;
   

    @Column({
        nullable: false,
        default: true
    })
    isTestActive: boolean;

    
    @Column({
        nullable: false,
    })
    test_public_key: string;

    @Column({
        nullable: false,
        
    })
    test_private_key: string;

    // @OneToOne(() => Merchant)
    // @JoinColumn()
    // merchant: Merchant

    // @OneToOne(type => Merchant, merchant => merchant.keys)
    // merchant: Merchant

    @OneToOne(() => Merchant, (merchant: Merchant) => merchant.keys, { cascade: true })
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