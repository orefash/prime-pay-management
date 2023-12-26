import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Merchant } from "../../../../libs/db-lib/src/models/Merchant";


@Entity()
export class ResetToken {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

    @Column({
        nullable: false,
    })
    token: string;

    @OneToOne(() => Merchant)
    @JoinColumn()
    merchant: Merchant

    @CreateDateColumn({
        nullable: false,
    })
    orderDate: Date;

}