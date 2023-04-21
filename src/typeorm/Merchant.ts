import { Address } from "src/types/address.interface";
import { BankDetails } from "src/types/bank_details.interface";
import { Socials } from "src/types/socials.interface";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { MerchantCustomer } from "./MerchantCustomer";
import { MerchantTransaction } from "./MerchantTransaction";

@Entity()
@Unique(['email', 'accountNo', ])
export class Merchant {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
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
    websiteUrl: string;

    @Column({
        nullable: true,
    })
    cacUrl: string;

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
    orderDate: Date;


    // @OneToMany( type => MerchantTransaction , transaction => transaction.merchant)
    // transactions: MerchantTransaction[];

}