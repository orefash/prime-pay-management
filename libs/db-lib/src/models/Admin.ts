
import { Address } from "@app/db-lib/types/address.interface";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
// import { MerchantProduct } from "./MerchantProducts";
// import { MerchantPayout } from "./MerchantPayout";
// import { MerchantKey } from "./Keys";

@Entity()
@Unique(['email'])
export class AdminUser {

    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column({
        nullable: false,
        name: 'fname'
    })
    fname: string;


    @Column({
        nullable: false,
        name: 'lname'
    })
    lanme: string;


    @Column({
        nullable: false,
        name: 'email'
    })
    email: string;
 

    @Column({
        nullable: false,
    })
    password: string;

   
    @CreateDateColumn({
        nullable: false,
    })
    regDate: Date;


    @UpdateDateColumn({
        nullable: false,
    })
    modifiedDate: Date;



    // @OneToOne(type => MerchantKey, key => key.merchant)
    // keys: MerchantKey;

}