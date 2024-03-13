import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('story-spooling') private readonly storySpoolingQueue: Queue,
  ) {}

  async addToQueue(data: any) {
    await this.storySpoolingQueue.add('processSpooling', data);
  }
}
