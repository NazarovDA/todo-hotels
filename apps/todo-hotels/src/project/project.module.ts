import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController],
  imports: [AuthModule],
})
export class ProjectModule {}
