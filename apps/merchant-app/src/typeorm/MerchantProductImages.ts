import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Merchant } from '../../../../libs/db-lib/src/models/Merchant';
import { MerchantProduct } from '../../../../libs/db-lib/src/models/MerchantProducts';

@Entity()
export class MerchantProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    filename: string;

    @Column({
        nullable: false,
    })
    mimeType: string;


    // Define the relationship with product
    // @ManyToOne(() => MerchantProduct, product => product.images)
    // product: MerchantProduct;

   

}