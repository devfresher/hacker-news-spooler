import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { StoryService } from '../services/story.service';

@Injectable()
@Processor('storySpooling')
export class StorySpoolingJob {
  private readonly logger = new Logger(StorySpoolingJob.name);

  constructor(private readonly storyService: StoryService) {}

  @Process()
  async handleSpoolingJob() {
    try {
      this.logger.log('Data spooling job started...');

      // Call the data service to initiate the data spooling process
      await this.storyService.spoolData();

      this.logger.log('Data spooling job completed.');
    } catch (error) {
      this.logger.error(`Error occurred during data spooling: ${error}`);
      throw error;
    }
  }
}
