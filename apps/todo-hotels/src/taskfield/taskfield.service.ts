import { Injectable } from '@nestjs/common';
import prismaClient from 'apps/prisma/db';
import { TaskFieldPostDto } from './types';
import {
  deleteFieldValue,
  getFieldValue,
  postFieldValue,
  updateFieldValue,
} from './golangBridge';

@Injectable()
export class TaskfieldService {
  async create(userId: string, taskField: TaskFieldPostDto) {
    const task = await prismaClient.task.findUnique({
      where: {
        id: taskField.taskId,
        column: {
          project: {
            userId,
            id: taskField.projectId,
          },
        },
      },
    });
    if (!task) return;

    const _taskField = await prismaClient.taskField.create({
      data: {
        taskId: task.id,
        projectId: taskField.projectId,
        name: taskField.name,
        // value: taskField.value.toString(),
        type: taskField.type,
      },
    });
    try {
      const goResp = await postFieldValue(
        _taskField.value,
        taskField.value.toString(),
      );
      return { ..._taskField, value: goResp.value };
    } catch (e) {
      await prismaClient.taskField.delete({
        where: {
          id: _taskField.id,
        },
      });
      throw e;
    }
  }

  async getAllTaskFields(userId: string, taskId: string) {
    const taskField = await prismaClient.taskField.findMany({
      where: {
        task: { id: taskId },
        project: {
          user: {
            id: userId,
          },
        },
      },
    });

    const ids = [];
    for (const val of taskField) {
      ids.push(val.value);
      val.value = '';
    }

    const ans = await getFieldValue(ids);

    for (const field of taskField) {
      for (const val of ans) {
        if (val.id === field.value) {
          field.value = val.value;
          break;
        }
      }
    }

    return taskField;
  }

  async getTaskFieldById(userId: string, taskFieldId: string) {
    const taskField = await prismaClient.taskField.findUnique({
      where: {
        id: taskFieldId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });

    const ans = await getFieldValue([taskField.id]);

    for (const val of ans) {
      if (val.id === taskField.value) {
        taskField.value = val.value;
        break;
      }
    }

    return taskField;
  }

  async updateTaskField(
    userId: string,
    taskFieldId: string,
    updatedTaskField: TaskFieldPostDto,
  ) {
    const taskField = await prismaClient.taskField.update({
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

    const goResp = await updateFieldValue(
      taskField.value,
      taskField.value.toString(),
    );

    taskField.value = goResp.value;

    return taskField;
  }

  async deleteTaskField(userId: string, taskFieldId: string) {
    const taskField = await prismaClient.taskField.delete({
      where: {
        id: taskFieldId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });

    await deleteFieldValue(taskField.id);

    return taskField;
  }
}
