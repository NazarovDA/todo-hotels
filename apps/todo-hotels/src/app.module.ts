import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { JwtModule } from './jwt/jwt.module';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TaskfieldModule } from './taskfield/taskfield.module';

@Module({
  controllers: [AuthController],
  providers: [AppService, AuthService],
  imports: [
    AuthModule,
    ProjectModule,
    JwtModule,
    ColumnModule,
    TaskModule,
    RabbitmqModule,
    TaskfieldModule,
  ],
})
export class AppModule {}
