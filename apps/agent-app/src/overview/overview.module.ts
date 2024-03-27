import { Module } from '@nestjs/common';
import { OverviewService } from './services/overview/overview.service';
import { OverviewController } from './controller/overview/overview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from '@app/db-lib/models/MerchantTransaction';
import { MerchantCustomer } from '@app/db-lib/models/MerchantCustomer';

@Module({
    imports: [
        TypeOrmModule.forFeature([MerchantTransaction, MerchantCustomer]),

    ],
    providers: [OverviewService],
    controllers: [OverviewController]
})
export class OverviewModule {

}
