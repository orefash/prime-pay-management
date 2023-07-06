import { Controller, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { KeysService } from 'src/keys/services/keys/keys.service';
import { KeyFindResponse } from 'src/keys/types/KeyFindResponse';

@Controller('keys-3p')
export class Keys3partyController {
    constructor(private readonly keysService: KeysService) { }

    @Get('key/:key')
    // @UseGuards(JwtAuthenticationGuard)
    async findOne(@Param('key') key: string): Promise<Partial<KeyFindResponse>> {
        try {
            return await this.keysService.findByKey(key);
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

}
