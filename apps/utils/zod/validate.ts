import { HttpException, HttpStatus } from '@nestjs/common';
import * as z from 'zod';

export default async function validate<T extends z.AnyZodObject>(
  validator: T,
  target: any,
  parserParams?: Partial<z.ParseParams>,
) {
  try {
    return (await validator.parseAsync(target, parserParams)) as T['_output'];
  } catch (e) {
    throw new HttpException(
      'Validation Error',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
