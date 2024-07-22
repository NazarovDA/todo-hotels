import { ZodValidationPipe } from '@abitia/zod-dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { TaskPostDto, TaskPutDto } from './types';
import { GetUser } from '../auth/get-user.decorator';
import { TaskService } from './task.service';
import { User } from '@prisma/client';
import { ApiResponse } from '@nestjs/swagger';
import { TaskDeepDTO, TaskDTO } from '../returnTypes';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskPostDto })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  @UsePipes(ZodValidationPipe)
  async createTask(@GetUser() user: User, @Body() body: TaskPostDto) {
    const task = await this.taskService.createTask(user.id, body);
    if (!task) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    return task;
  }

  @Get(':taskId')
  @ApiResponse({ status: HttpStatus.OK, type: TaskDeepDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getTask(@GetUser() user: User, @Param('taskId') taskId: string) {
    const task = await this.taskService.getTask(user.id, taskId);
    if (!task) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return task;
  }

  @Get(':columnId')
  @ApiResponse({ status: HttpStatus.OK, type: [TaskDeepDTO] })
  async getTasks(@GetUser() user: User, @Param('columnId') columnId: string) {
    return await this.taskService.getTasks(user.id, columnId);
  }

  @Put(':columnId')
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.OK, type: TaskDTO })
  @UsePipes(ZodValidationPipe)
  async updateTask(
    @GetUser() user: User,
    @Param('columnId') columnId: string,
    @Body() newTask: TaskPutDto,
  ) {
    const task = await this.taskService.updateTask(user.id, columnId, newTask);
    if (!task) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return task;
  }

  @Delete(':taskId')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async deleteTask(@GetUser() user: User, @Param('taskId') taskId: string) {
    const task = await this.taskService.deleteTask(user.id, taskId);
    if (!task) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return;
  }
}
