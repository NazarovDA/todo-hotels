import { createZodDto } from '@abitia/zod-dto/dist/createZodDto';
import * as z from 'zod';

const TaskPostBodyDto = z.object({
  title: z.string(),
  description: z.string().optional(),
  columnId: z.string().cuid(),
});

const TaskPutBodyDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  columnId: z.string().cuid(),
  newIdx: z.number().optional(),
  newColumn: z.string().optional(),
});

export class TaskPutDto extends createZodDto(TaskPutBodyDTO) {}
export class TaskPostDto extends createZodDto(TaskPostBodyDto) {}
