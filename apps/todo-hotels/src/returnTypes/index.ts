import { createZodDto } from '@abitia/zod-dto';
import * as z from 'zod';

// task field
const taskFieldDTO = z.object({
  id: z.string().cuid(),
  name: z.string(),
  projectId: z.string().cuid(),
  type: z.enum(['string', 'number']),
  value: z.string().or(z.number()),
  taskId: z.string().cuid(),
});

// task
const taskDTO = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  columnId: z.string(),
  position: z.number(),
});

const taskDeepDTO = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  columnId: z.string(),
  position: z.number(),
});

// column
const columnDTO = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  projectId: z.string(),
  order: z.number(),
});

const columnDeepDTO = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  projectId: z.string(),
  order: z.number(),
  tasks: z.array(taskDeepDTO),
});

// project
const projectDTO = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  userId: z.string(),
});

const projectDeepDTO = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  userId: z.string(),
  column: z.array(columnDeepDTO),
});

// auth
const createUserAns = z.object({
  id: z.string(),
});

const AuthAns = z.object({
  jwt: z.string(),
});

export class ColumnDTO extends createZodDto(columnDTO) {}
export class ColumnDeepDTO extends createZodDto(columnDeepDTO) {}

export class AuthAnsDTO extends createZodDto(AuthAns) {}
export class CreateUserAnsDTO extends createZodDto(createUserAns) {}

export class ProjectDTO extends createZodDto(projectDTO) {}
export class ProjectDeepDTO extends createZodDto(projectDeepDTO) {}

export class TaskDTO extends createZodDto(taskDTO) {}
export class TaskDeepDTO extends createZodDto(taskDeepDTO) {}

export class TaskFieldDTO extends createZodDto(taskFieldDTO) {}
