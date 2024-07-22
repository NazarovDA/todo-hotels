import { createZodDto } from '@abitia/zod-dto/dist/createZodDto';
import * as z from 'zod';

const ProjectPostBodyDto = z.object({
  title: z.string(),
  description: z.string().optional(),
});
const ProjectPutBodyDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export class ProjectPutDto extends createZodDto(ProjectPutBodyDto) {}
export class ProjectPostDto extends createZodDto(ProjectPostBodyDto) {}
