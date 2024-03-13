import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueService } from './queue.service';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly hackerNewsAPIService: HackerNewsAPIService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async fetchDataFromAPI() {
    try {
      await this.simulateSpooling();
    } catch (error) {
      this.logger.error(`Error occurred during data spooling: ${error}`);
      throw error;
    }
  }

  async simulateSpooling() {
    this.logger.log(`Data spooling started...`);
    const { data } = await this.hackerNewsAPIService.fetchTopStories();

    this.logger.log(
      `Data spooling completed. Total spooled data: ${data.length}`,
    );
    this.queueService.addToQueue(data);
  }
}
