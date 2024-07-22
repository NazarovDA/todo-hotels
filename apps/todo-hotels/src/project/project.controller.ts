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
import { ProjectPostDto } from './types';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProjectDeepDTO, ProjectDTO } from '../returnTypes';

@Controller('project')
@ApiHeader({ name: 'Authorization', required: true })
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectDTO })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  async createProject(@GetUser() user: User, @Body() body: ProjectPostDto) {
    const projectId = await this.projectService.createProject(user.id, body);
    if (!projectId) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    return projectId;
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectDTO] })
  async getAllProjects(@GetUser() user: User) {
    return await this.projectService.getAllProjects(user.id);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: ProjectDeepDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getProjectById(@Param('id') id: string, @GetUser() user: User) {
    const project = await this.projectService.getProjectById(id, user.id);
    if (!project) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return await this.projectService.getProjectById(id, user.id);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.OK })
  async deleteProject(@Param('id') id: string, @GetUser() user: User) {
    const project = await this.projectService.deleteProjectById(user.id, id);
    if (!project) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return project;
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.OK, type: ProjectDTO })
  @UsePipes(ZodValidationPipe)
  async updateProject(
    @Param('id') id: string,
    @Body() body: ProjectPostDto,
    @GetUser() user: User,
  ) {
    const project = await this.projectService.updateProject(user.id, id, body);
    if (!project) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }
}
