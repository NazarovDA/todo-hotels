import { Module } from '@nestjs/common';
import { TaskfieldController } from './taskfield.controller';
import { TaskfieldService } from './taskfield.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TaskfieldController],
  providers: [TaskfieldService],
  imports: [AuthModule],
})
export class TaskfieldModule {}
