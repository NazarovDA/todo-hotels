import { Injectable } from '@nestjs/common';
import { ProjectPostDto, ProjectPutDto } from './types';
import prismaClient from 'apps/prisma/db';

@Injectable()
export class ProjectService {
  async createProject(userId: string, _project: ProjectPostDto) {
    const project = await prismaClient.project.create({
      data: {
        title: _project.title,
        userId: userId,
        description: _project.description,
      },
    });
    return project;
  }

  async updateProject(
    userId: string,
    projectId: string,
    _project: ProjectPutDto,
  ) {
    const project = await prismaClient.project.update({
      where: { id: projectId, userId },
      data: {
        title: _project.title,
        description: _project.description,
      },
    });
    return project;
  }

  async getAllProjects(userId: string) {
    return await prismaClient.project.findMany({
      where: { userId },
    });
  }

  async getProjectById(projectId: string, userId: string) {
    return await prismaClient.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
  }

  async deleteProjectById(userId: string, projectId: string) {
    const project = await prismaClient.project.delete({
      where: {
        id: projectId,
        user: {
          id: userId,
        },
      },
    });
    return project;
  }
}
