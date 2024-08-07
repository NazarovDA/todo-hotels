import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  Put,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { TaskfieldService } from './taskfield.service';
import { ZodValidationPipe } from '@abitia/zod-dto/dist/ZodValidationPipe';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';
import { TaskFieldPostDto } from './types';
import { TaskFieldDTO } from '../returnTypes';

@Controller('taskfield')
@UseGuards(JwtAuthGuard)
@ApiHeader({ name: 'Authorization', required: true })
export class TaskfieldController {
  constructor(private readonly taskfieldService: TaskfieldService) {}
  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiResponse({ status: HttpStatus.OK, type: TaskFieldDTO })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  async createTaskfield(@GetUser() user: User, @Body() body: TaskFieldPostDto) {
    if (typeof body.value !== body.type)
      throw new HttpException('Validation Error', HttpStatus.BAD_REQUEST);

    const ans = await this.taskfieldService.create(user.id, body);
    if (!ans) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    return ans;
  }

  @Get('/task/:taskId')
  @ApiResponse({ status: HttpStatus.OK, type: [TaskFieldDTO] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getAllTaskFields(
    @GetUser() user: User,
    @Param('taskId') taskId: string,
  ) {
    const taskFields = await this.taskfieldService.getAllTaskFields(
      user.id,
      taskId,
    );
    if (!taskFields) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return taskFields;
  }

  @Get(':taskFieldId')
  @ApiResponse({ status: HttpStatus.OK, type: TaskFieldDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getTaskFieldById(
    @GetUser() user: User,
    @Param('taskFieldId') taskFieldId: string,
  ) {
    const taskField = await this.taskfieldService.getTaskFieldById(
      user.id,
      taskFieldId,
    );
    if (!taskField) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return taskField;
  }

  @Put(':taskFieldId')
  @UsePipes(ZodValidationPipe)
  @ApiResponse({ status: HttpStatus.OK, type: TaskFieldDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async updateTaskField(
    @GetUser() user: User,
    @Param('taskFieldId') taskFieldId: string,
    @Body() updatedTaskField: TaskFieldPostDto,
  ) {
    const taskField = await this.taskfieldService.updateTaskField(
      user.id,
      taskFieldId,
      updatedTaskField,
    );
    if (!taskField) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return taskField;
  }

  @Delete(':taskFieldId')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async deleteTaskField(
    @GetUser() user: User,
    @Param('taskFieldId') taskFieldId: string,
  ) {
    const taskField = await this.taskfieldService.deleteTaskField(
      user.id,
      taskFieldId,
    );
    if (!taskField) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return;
  }
}
