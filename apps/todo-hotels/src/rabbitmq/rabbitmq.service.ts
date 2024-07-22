// src/rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserAns, GetIdAns } from './types';

@Injectable()
export class RabbitmqService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`,
        ],
        queue: 'auth_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendNewUser(user) {
    return (await firstValueFrom(
      this.client.send('sendUser', user),
    )) as CreateUserAns;
  }

  async authUser(user) {
    return (await firstValueFrom(this.client.send('getId', user))) as GetIdAns;
  }
}
