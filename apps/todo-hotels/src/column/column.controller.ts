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
import { ColumnService } from './column.service';
import { ZodValidationPipe } from '@abitia/zod-dto';
import { ColumnsPostDto, ColumnsUpdateDto } from './types';
import { User } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ColumnDeepDTO, ColumnDTO } from '../returnTypes';

@ApiHeader({ name: 'Authorization', required: true })
@Controller('column')
@UseGuards(JwtAuthGuard)
export class ColumnController {
  constructor(private readonly columnsService: ColumnService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiResponse({ status: HttpStatus.OK, type: ColumnDTO })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  async createColumn(@GetUser() user: User, @Body() body: ColumnsPostDto) {
    const ans = await this.columnsService.createColumn(user.id, body);
    if (!ans) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    return ans;
  }

  @Get(':projectId')
  @ApiResponse({ status: HttpStatus.OK, type: [ColumnDTO] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getAllColumns(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    const columns = await this.columnsService.getColumns(user.id, projectId);
    if (!columns) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return columns;
  }

  @Get(':columnId')
  @ApiResponse({ status: HttpStatus.OK, type: ColumnDeepDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getColumn(@GetUser() user: User, @Param('columnId') columnId: string) {
    const column = await this.columnsService.getColumn(user.id, columnId);
    if (!column) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return column;
  }

  @Delete(':columnId')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async deleteColumn(
    @GetUser() user: User,
    @Param('columnId') columnId: string,
  ) {
    const column = await this.columnsService.deleteColumn(user.id, columnId);
    if (!column) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return;
  }

  @Put(':columnId')
  @ApiResponse({ status: HttpStatus.OK, type: ColumnDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @UsePipes(ZodValidationPipe)
  async updateColumn(
    @GetUser() user: User,
    @Param('columnId') columnId: string,
    @Body() newColumn: ColumnsUpdateDto,
  ) {
    const column = await this.columnsService.updateColumn(
      user.id,
      columnId,
      newColumn,
    );
    if (!column) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return column;
  }
}
