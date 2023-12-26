import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Merchant } from './Merchant';
import { ProductImageDto } from '../../../../apps/merchant-app/src/merchant-product/dto/Upload.dto';

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
    actualPrice: number;

    @Column({
        nullable: true,
    })
    quantity: number;

    @Column({
        nullable: true,
    })
    description: string;

    @Column({
        nullable: false,
    })
    summary: string;

    @Column({
        nullable: false,
    })
    category: string;

    // @Column({
    //     nullable: true,
    // })
    // imageMime: string;

    // Define the relationship with images
    // @OneToMany(() => MerchantProductImage, image => image.product, { cascade: true })
    // images: MerchantProductImage[];

    @Column('jsonb', { nullable: true })
    pImages: ProductImageDto[];

    @ManyToOne(() => Merchant, merchant => merchant.products)
    merchant: Merchant;

    @Column({
        nullable: false,
        default: true
    })
    isActive: boolean;

    @Column({
        nullable: false,
        default: true
    })
    isVerified: boolean;


    @CreateDateColumn({
        nullable: false,
    })
    createDate: Date;

    @UpdateDateColumn({
        nullable: false,
    })
    modifiedDate: Date;

}