import { Injectable } from '@nestjs/common';
import prismaClient from 'apps/prisma/db';
import { TaskPostDto, TaskPutDto } from './types';
import range from 'apps/utils/range';

@Injectable()
export class TaskService {
  async createTask(userId: string, task: TaskPostDto) {
    const column = await prismaClient.column.findUnique({
      where: {
        id: task.columnId,
        project: {
          user: {
            id: userId,
          },
        },
      },
      include: {
        project: true,
      },
    });
    if (!column) return;
    const taskRet = await prismaClient.task.create({
      data: {
        title: task.title,
        description: task.description,
        columnId: task.columnId,
        position: await prismaClient.task.count({
          where: {
            columnId: task.columnId,
          },
        }),
      },
    });
    return taskRet;
  }

  async getTask(userId: string, taskId: string) {
    return await prismaClient.task.findUnique({
      where: {
        id: taskId,
        column: {
          project: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
  }

  async getTasks(userId: string, columnId: string) {
    return await prismaClient.task.findMany({
      where: {
        columnId,
        column: {
          project: {
            user: {
              id: userId,
            },
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async updateTask(userId: string, columnId: string, newTask: TaskPutDto) {
    const task = await prismaClient.task.findUnique({
      where: {
        id: columnId,
        columnId,
        column: {
          project: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
    if (!task) return;
    if (newTask.newColumn) {
      const newColumn = await prismaClient.column.findUnique({
        where: {
          id: newTask.newColumn,
          project: {
            userId,
            id: newTask.newColumn,
          },
        },
      });
      if (!newColumn) return;
      await prismaClient.task.update({
        where: {
          id: columnId,
        },
        data: {
          columnId: newColumn.id,
          position: await prismaClient.task.count({
            where: {
              columnId: newColumn.id,
            },
          }),
        },
      });
      const newOrder = await prismaClient.task.findMany({
        where: {
          columnId,
        },
        orderBy: {
          position: 'asc',
        },
      });
      range(1, newOrder.length).forEach(async (order, idx) => {
        await prismaClient.task.update({
          where: {
            id: newOrder[idx].id,
          },
          data: {
            position: idx + 1,
          },
        });
      });
    }
    if (newTask.newIdx) {
      if (task.position < newTask.newIdx) {
        await prismaClient.task.updateMany({
          where: {
            columnId,
            position: { gt: newTask.newIdx, lte: newTask.newIdx },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      } else {
        await prismaClient.task.updateMany({
          where: {
            columnId,
            position: { gte: newTask.newIdx, lt: task.position },
          },
          data: {
            position: { increment: 1 },
          },
        });
      }
    }
    return await prismaClient.task.update({
      where: {
        id: columnId,
      },
      data: {
        title: newTask.title,
        description: newTask.description,
      },
    });
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await prismaClient.task.findUnique({
      where: {
        id: taskId,
        column: {
          project: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
    if (!task) return;
    await prismaClient.task.delete({
      where: {
        id: taskId,
      },
    });
    const newOrder = await prismaClient.task.findMany({
      where: {
        columnId: task.columnId,
      },
      orderBy: {
        position: 'asc',
      },
    });
    range(1, newOrder.length).forEach(async (order, idx) => {
      await prismaClient.task.update({
        where: {
          id: newOrder[idx].id,
        },
        data: {
          position: idx + 1,
        },
      });
    });
    return task;
  }
}
