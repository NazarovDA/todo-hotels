import { Module } from '@nestjs/common';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService],
  imports: [AuthModule],
})
export class ColumnModule {}
