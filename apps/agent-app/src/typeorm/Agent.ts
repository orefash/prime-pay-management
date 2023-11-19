
import { Address } from "@app/db-lib/types/address.interface";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
// import { MerchantProduct } from "./MerchantProducts";
// import { MerchantPayout } from "./MerchantPayout";
// import { MerchantKey } from "./Keys";

@Entity()
@Unique(['email'])
export class Agent {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index({ unique: true })
    @Column({
        nullable: false,
    })
    agentCode: string;


    @Column({
        nullable: false,
        default: 0
    })
    availableBalance: number;


    // @Column({
    //     nullable: false,
    // })
    // name: string;

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


    // @Column({
    //     nullable: true,
    // })
    // cacPath: string;


    // @Column({
    //     nullable: true,
    // })
    // cacMime: string;

    @Column({
        nullable: true,
    })
    recepientCode: string;


    @Column({
        nullable: false,
        name: 'agent_fname'
    })
    agentFname: string;


    @Column({
        nullable: false,
        name: 'agent_lname'
    })
    agentLname: string;

    @Column({
        nullable: false,
        name: 'bvn',
        length: 11
    })
    bvn: string;


    // @spe: string;

    // @Column({
    //     nullable: false,
    //     name: 'is_registered',
    //     default: false
    // })
    // isRegistered: boolean;

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

    @Column({
        nullable: true,
    })
    IdType: string;

    @Column({
        nullable: true,
    })
    IdUrl: string;

    @Column({
        nullable: true,
    })
    agentId: string;

    @Column({
        nullable: true,
    })
    IdMime: string;

   

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

    // @Column({
    //     name: 'avg_monthly_sales',
    //     nullable: true
    // })
    // avgMonthlySales: number;

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
        nullable: true,
    })
    marketSector: string;

    @Column({
        nullable: false,
    })
    stateOfOrigin: string;

    // @Column({
    //     type: 'jsonb',
    //     nullable: true,
    //     name: 'socials'
    // })
    // socials: Socials;

   

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