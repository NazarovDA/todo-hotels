import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@abitia/zod-dto';
import { CreateUserDto, AuthUserDto } from './types';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthAnsDTO, CreateUserAnsDTO } from '../returnTypes';

@Controller('auth')
export class AuthController {
  constructor(private readonly rabbitMQ: RabbitmqService) {}
  @Post('/reg')
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateUserAnsDTO })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  @UsePipes(ZodValidationPipe)
  async reg(@Body() body: CreateUserDto) {
    const data = await this.rabbitMQ.sendNewUser(body);

    if (!data.ok) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    return data.id;

    // const id = await this.authService.createUser(body);
    // if (!id) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    // return id;
  }

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: AuthAnsDTO })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  @UsePipes(ZodValidationPipe)
  async auth(@Body() body: AuthUserDto) {
    const data = await this.rabbitMQ.authUser(body);
    if (!data.ok)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return { jwt: data.jwt };
  }
}
