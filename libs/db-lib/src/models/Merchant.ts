import { Address } from "../../../../apps/merchant-app/src/types/address.interface";
import { Socials } from "../../../../apps/merchant-app/src/types/socials.interface";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { MerchantProduct } from "./MerchantProducts";
import { MerchantPayout } from "./MerchantPayout";
import { MerchantKey } from "./Keys";
import { CACDocType } from "../../../../apps/merchant-app/src/merchants/dto/SetCAC.dto";
import { MerchantTransaction } from "./MerchantTransaction";
import { IDDocType } from "apps/merchant-app/src/merchants/dto/SetMerchantIdentification.dto";

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


    @Column({
        nullable: false,
        default: false
    })
    payoutPending: boolean;

    @Column({
        nullable: false,
        name: 'is_confirmed',
        default: false
    })
    isConfirmed: boolean;

    @Index({ unique: false })
    @Column({
        nullable: false,
        name: 'is_active',
        default: false
    })
    isActive: boolean;

    @Index({ unique: false })
    @Column({
        nullable: false,
        name: 'is_verified',
        default: false
    })
    isVerified: boolean;

    // @Column({
    //     nullable: true,
    // })
    // promoterIdType: string;

    // @Column({
    //     nullable: true,
    // })
    // promoterIdUrl: string;

    // @Column({
    //     nullable: true,
    // })
    // promoterId: string;

    // @Column({
    //     nullable: true,
    // })
    // promoterIdMime: string;

    @Column({
        nullable: true,
    })
    websiteUrl: string;


    // @Column({
    //     nullable: true,
    // })
    // cacUrl: string;

    // @Column("text", {
    //     nullable: true,
    //     array: true
    // })
    // cacDocs: string[];

    @Column('jsonb', { nullable: true })
    cacDocuments: CACDocType[];


    @Column('jsonb', { nullable: true })
    idDocuments: IDDocType[];

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


    @OneToMany( type => MerchantTransaction , transaction => transaction.merchant)
    transactions: MerchantTransaction[];


    @OneToOne(type => MerchantKey, key => key.merchant)
    keys: MerchantKey;

}