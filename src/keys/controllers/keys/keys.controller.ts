import { Controller, Get, Post, Patch, Delete, Param, HttpException, HttpStatus, ParseBoolPipe, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { KeysService } from 'src/keys/services/keys/keys.service';
import { MerchantKey } from 'src/typeorm';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async findAll(): Promise<MerchantKey[]> {
    try {
      return await this.keysService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('merchant/:id')
  @UseGuards(JwtAuthenticationGuard)
  async findOne(@Param('id') mid: string): Promise<MerchantKey> {
    try {
      return await this.keysService.findByMerchant(mid);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

//   @Post('create/merchant/:id')
//   async create(@Param('id') id: string): Promise<MerchantKey> {
//     try {
//       return await this.keysService.create(id);
//     } catch (err) {
//       throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

  @Patch('/merchant/:id/reset-keys/live/:isLive')
  @UseGuards(JwtAuthenticationGuard)
  async resetKeys(@Param('id') mid: string, @Param('isLive', ParseBoolPipe) isLive: boolean): Promise<MerchantKey> {
    try {
      return await this.keysService.resetKeys(mid, isLive);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('merchant/:id/toggle-key-state/live/:isLive')
  @UseGuards(JwtAuthenticationGuard)
  async toggleKeyState(@Param('id') mid: string, @Param('isLive', ParseBoolPipe) isLive: boolean): Promise<MerchantKey> {
    try {
      return await this.keysService.toggleKeyState(mid, isLive);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this.keysService.delete(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
}
