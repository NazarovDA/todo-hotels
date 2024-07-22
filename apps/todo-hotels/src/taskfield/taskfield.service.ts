import { Injectable } from '@nestjs/common';
import prismaClient from 'apps/prisma/db';
import { TaskFieldPostDto } from './types';

@Injectable()
export class TaskfieldService {
  async create(userId: string, taskField: TaskFieldPostDto) {
    const task = await prismaClient.task.findUnique({
      where: {
        id: taskField.taskId,
        column: {
          project: {
            user: {
              id: userId,
            },
            id: taskField.projectId,
          },
        },
      },
    });

    if (!task) return;

    return await prismaClient.taskField.create({
      data: {
        task: { connect: { id: task.id } },
        project: { connect: { id: taskField.taskId } },
        name: taskField.name,
        value: taskField.value.toString(),
        type: taskField.type,
      },
    });
  }

  async getAllTaskFields(userId: string, taskId: string) {
    return await prismaClient.taskField.findMany({
      where: {
        task: { id: taskId },
        project: {
          user: {
            id: userId,
          },
        },
      },
    });
  }

  async getTaskFieldById(userId: string, taskFieldId: string) {
    return await prismaClient.taskField.findUnique({
      where: {
        id: taskFieldId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });
  }

  async updateTaskField(
    userId: string,
    taskFieldId: string,
    updatedTaskField: TaskFieldPostDto,
  ) {
    return await prismaClient.taskField.update({
      where: {
        id: taskFieldId,
        project: {
          user: {
            id: userId,
          },
        },
      },
      data: {
        name: updatedTaskField.name,
        value: updatedTaskField.value.toString(),
        type: updatedTaskField.type,
      },
    });
  }

  async deleteTaskField(userId: string, taskFieldId: string) {
    return await prismaClient.taskField.delete({
      where: {
        id: taskFieldId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });
  }
}
