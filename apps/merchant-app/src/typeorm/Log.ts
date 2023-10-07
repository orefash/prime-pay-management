// log.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    method: string;

    @Column()
    url: string;

    @Column()
    requestBody: string;

    @Column()
    responseBody: string;


    @Column()
    userAgent: string;

    @Column()
    statusCode: number;

    @Column()
    contentLength: number;

    @Column()
    responseTime: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;
}
