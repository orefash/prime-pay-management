import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenericLocalStrategy } from './strategies/generic-local.strategy';

@Module({
  providers: [GenericLocalStrategy],
  exports: [GenericLocalStrategy],
})
export class AuthLibModule {}
