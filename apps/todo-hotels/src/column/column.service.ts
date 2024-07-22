import { Injectable } from '@nestjs/common';
import { ColumnsPostDto, ColumnsUpdateDto } from './types';
import prismaClient from 'apps/prisma/db';
import range from 'apps/utils/range';

@Injectable()
export class ColumnService {
  async createColumn(userId: string, _column: ColumnsPostDto) {
    const project = await prismaClient.project.findFirst({
      where: {
        id: _column.projectId,
        userId: userId,
      },
    });
    if (!project) {
      return;
    }
    const count = await prismaClient.column.count({
      where: {
        projectId: _column.projectId,
      },
    });
    const column = await prismaClient.column.create({
      data: {
        title: _column.title,
        projectId: _column.projectId,
        order: count + 1,
      },
    });
    return column;
  }

  async updateColumn(
    userId: string,
    _columnId: string,
    newColumn: ColumnsUpdateDto,
  ) {
    const column = await prismaClient.column.findUnique({
      where: {
        id: _columnId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (newColumn.newIdx) {
      if (column.order < newColumn.newIdx) {
        await prismaClient.column.updateMany({
          where: {
            projectId: column.projectId,
            order: {
              gt: column.order,
              lte: newColumn.newIdx,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      } else {
        await prismaClient.column.updateMany({
          where: {
            projectId: column.projectId,
            order: {
              gte: newColumn.newIdx,
              lt: column.order,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }
    }
    return await prismaClient.column.update({
      where: {
        id: _columnId,
      },
      data: {
        order: newColumn.newIdx,
      },
    });
  }

  async deleteColumn(userId: string, _columnId: string) {
    const column = await prismaClient.column.findUnique({
      where: {
        id: _columnId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (column) {
      await prismaClient.column.delete({
        where: {
          id: _columnId,
        },
      });
    }
    const newOrder = await prismaClient.column.findMany({
      where: {
        projectId: column.projectId,
      },
      orderBy: {
        order: 'asc',
      },
    });
    range(1, newOrder.length).forEach(async (order, idx) => {
      await prismaClient.column.update({
        where: {
          id: newOrder[idx].id,
        },
        data: {
          order: idx + 1,
        },
      });
    });
    return column;
  }

  async getColumn(userId: string, _columnId: string) {
    const column = await prismaClient.column.findUnique({
      where: {
        id: _columnId,
        project: {
          user: {
            id: userId,
          },
        },
      },
    });
    return column;
  }

  async getColumns(userId: string, projectId: string) {
    const columns = await prismaClient.column.findMany({
      where: {
        project: {
          id: projectId,
          user: {
            id: userId,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
    return columns;
  }
}
