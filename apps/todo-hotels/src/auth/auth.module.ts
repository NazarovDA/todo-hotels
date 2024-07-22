import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [RabbitmqModule],
})
export class AuthModule {}
