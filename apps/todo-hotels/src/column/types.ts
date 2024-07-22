import { createZodDto } from '@abitia/zod-dto';
import * as z from 'zod';

const columnsPostBody = z.object({
  title: z.string(),
  description: z.string().optional(),
  projectId: z.string().cuid(),
});

const columnsUpdateBody = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  newIdx: z.number().optional(),
  projectId: z.string().cuid(),
});

export class ColumnsUpdateDto extends createZodDto(columnsUpdateBody) {}
export class ColumnsPostDto extends createZodDto(columnsPostBody) {}
