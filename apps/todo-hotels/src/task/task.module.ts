import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [AuthModule],
})
export class TaskModule {}
