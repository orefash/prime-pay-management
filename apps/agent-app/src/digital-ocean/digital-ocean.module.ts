import { Module } from '@nestjs/common';
import { SpacesService } from './services/spaces/spaces.service';

@Module({
    imports: [

    ],
    providers: [SpacesService],
    exports: [SpacesService],
    controllers: []
})
export class DigitalOceanModule {

}
