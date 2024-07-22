import { createZodDto } from '@abitia/zod-dto/dist/createZodDto';
import * as z from 'zod';

// RFC 5322 compliant regex (overkill)
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// валидацию пароля отдаем фронтенду, принимая хэш пароля
const passRegex = /^[a-fA-F0-9]{64}$/;

const createUserDtoSchema = z.object({
  email: z.string().regex(emailRegex),
  password: z.string().length(64).regex(passRegex),
});

const authUserDtoSchema = z.object({
  email: z.string().regex(emailRegex),
  password: z.string().regex(passRegex),
});

export class CreateUserDto extends createZodDto(createUserDtoSchema) {}
export class AuthUserDto extends createZodDto(authUserDtoSchema) {}
