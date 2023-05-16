import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Merchant } from './Merchant';

@Entity()
export class MerchantProduct {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    item: string;

    @Column({
        nullable: false,
    })
    price: number;

    @Column({
        nullable: true,
    })
    description: string;

    @Column({
        nullable: true,
    })
    imagePath: string;

    @Column({
        nullable: true,
    })
    imageMime: string;

    @ManyToOne(() => Merchant, merchant => merchant.products)
    merchant: Merchant;

    @Column({
        nullable: false,
        default: true
    })
    isActive: boolean;


    @CreateDateColumn({
        nullable: false,
    })
    createDate: Date;

    @UpdateDateColumn({
        nullable: false,
    })
    modifiedDate: Date;

}