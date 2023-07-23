import { Address } from "src/types/address.interface";
import { Socials } from "src/types/socials.interface";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { MerchantProduct } from "./MerchantProducts";
import { MerchantPayout } from "./MerchantPayout";
import { MerchantKey } from "./Keys";

@Entity()
@Unique(['email', 'accountNo',])
export class Merchant {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index({ unique: false })
    @Column({
        nullable: false,
        default: -99
    })
    systemId: number;


    @Column({
        nullable: false,
        default: 0
    })
    availableBalance: number;


    @Column({
        nullable: false,
        default: 0
    })
    actualBalance: number;


    @Column({
        nullable: false,
    })
    name: string;

    @Column({
        nullable: true,
        name: 'logo_url'
    })
    logoUrl: string;


    @Column({
        nullable: true,
        name: 'logo_doc'
    })
    logoPath: string;

    
    @Column({
        nullable: true,
    })
    logoMime: string;


    @Column({
        nullable: true,
    })
    cacPath: string;


    @Column({
        nullable: true,
    })
    cacMime: string;

    @Column({
        nullable: true,
    })
    recepientCode: string;


    @Column({
        nullable: false,
        name: 'promoter_fname'
    })
    promoterFname: string;


    @Column({
        nullable: false,
        name: 'promoter_lname'
    })
    promoterLname: string;

    @Column({
        nullable: true,
        name: 'bvn',
        length: 11
    })
    bvn: string;


    @Column({
        nullable: true,
        name: 'business_type'
    })
    businessType: string;

    @Column({
        nullable: false,
        name: 'is_registered',
        default: false
    })
    isRegistered: boolean;

    @Index({ unique: false })
    @Column({
        nullable: false,
        name: 'is_active',
        default: false
    })
    isActive: boolean;

    @Column({
        nullable: true,
    })
    promoterIdType: string;

    @Column({
        nullable: true,
    })
    promoterIdUrl: string;

    @Column({
        nullable: true,
    })
    promoterId: string;

    @Column({
        nullable: true,
    })
    promoterIdMime: string;

    @Column({
        nullable: true,
    })
    websiteUrl: string;


    @Column({
        nullable: true,
    })
    cacUrl: string;

    @Column("text", {
        nullable: true,
        array: true
    })
    cacDocs: string[];


    @Index({ unique: true })
    @Column({
        nullable: false,
    })
    email: string;

    @Column({
        nullable: false,
        name: 'phone_number'
    })
    phone: string;

    @Column({
        nullable: false,
    })
    password: string;


    @Column({
        type: 'jsonb',
        nullable: true
    })
    address: Address;

    @Column({
        name: 'avg_monthly_sales',
        nullable: true
    })
    avgMonthlySales: number;

    @Column({
        nullable: true,
        length: 10
    })
    accountNo: string;

    @Column({
        nullable: true,
    })
    bankCode: string;

    @Column({
        nullable: true,
    })
    bankName: string;

    @Column({
        type: 'jsonb',
        nullable: true,
        name: 'socials'
    })
    socials: Socials;

    @OneToMany(() => MerchantProduct, product => product.merchant)
    products: MerchantProduct[];

    @CreateDateColumn({
        nullable: false,
    })
    regDate: Date;

    @UpdateDateColumn({
        nullable: false,
    })
    modifiedDate: Date;

    @OneToMany( type => MerchantPayout , payout => payout.merchant)
    payouts: MerchantPayout[];


    @OneToOne(type => MerchantKey, key => key.merchant)
    keys: MerchantKey;

}