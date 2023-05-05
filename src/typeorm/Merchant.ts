import { Address } from "src/types/address.interface";
import { BankDetails } from "src/types/bank_details.interface";
import { Socials } from "src/types/socials.interface";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantTransaction } from "./MerchantTransaction";
import { Exclude } from "class-transformer";

@Entity()
@Unique(['email', 'accountNo',])
export class Merchant {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
        default: -99
    })
    systemId: number;

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
        length: 10
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
    @Exclude()
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
        nullable: false,
    })
    accountNo: string;

    @Column({
        nullable: false,
    })
    bankCode: string;

    @Column({
        nullable: false,
    })
    bankName: string;

    @Column({
        type: 'jsonb',
        nullable: true,
        name: 'socials'
    })
    socials: Socials;

    @CreateDateColumn({
        nullable: false,
    })
    regDate: Date;

    @UpdateDateColumn({
        nullable: false,
    })
    modifiedDate: Date;

    // @OneToMany( type => MerchantTransaction , transaction => transaction.merchant)
    // transactions: MerchantTransaction[];

}