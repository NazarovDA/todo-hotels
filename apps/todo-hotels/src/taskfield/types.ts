import { createZodDto } from '@abitia/zod-dto/dist/createZodDto';
import * as z from 'zod';

const taskFieldPostDTO = z.object({
  name: z.string(),
  projectId: z.string().cuid(),
  type: z.enum(['string', 'number']),
  value: z.string().or(z.number()),
  taskId: z.string().cuid(),
});

const taskFieldUpdateDTO = z.object({
  name: z.string().optional(),
  projectId: z.string().cuid().optional(),
  type: z.enum(['string', 'number']).optional(),
  value: z.string().or(z.number()).optional(),
  taskId: z.string().cuid().optional(),
});

export class TaskFieldUpdateDto extends createZodDto(taskFieldUpdateDTO) {}
export class TaskFieldPostDto extends createZodDto(taskFieldPostDTO) {}
