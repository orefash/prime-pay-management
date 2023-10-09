import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Agent } from "./Agent";


@Entity({ name: 'agent_reset_token' })
export class ResetToken {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

    @Column({
        nullable: false,
    })
    token: string;

    @OneToOne(() => Agent)
    @JoinColumn()
    agent: Agent

    @CreateDateColumn({
        nullable: false,
    })
    orderDate: Date;

}