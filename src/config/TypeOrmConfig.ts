import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import entities from "src/typeorm";


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {

        const isDevelopment: boolean = this.configService.get('NODE_ENV') == 'development' ? true : false;
        console.log('isdev: ', isDevelopment)
        return {
            type: 'postgres',
            host: isDevelopment? this.configService.get('POSTGRES_HOST_DEV') : this.configService.get('POSTGRES_HOST'),
            port: isDevelopment? this.configService.get<number>('POSTGRES_PORT_DEV') : this.configService.get<number>('POSTGRES_PORT'),
            username: isDevelopment? this.configService.get('POSTGRES_USER_DEV') : this.configService.get('POSTGRES_USER'),
            password: isDevelopment? this.configService.get('POSTGRES_PASSWORD_DEV') : this.configService.get('POSTGRES_PASSWORD'),
            database: isDevelopment? this.configService.get('POSTGRES_DB_DEV') : this.configService.get('POSTGRES_DB'),
            entities: entities,
            synchronize: true //isDevelopment? true : false,
        }
    }
}
