import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { StoryService } from '../services/story.service';

@Injectable()
@Processor('story-spooling')
export class StorySpoolingProcessor {
  private readonly logger = new Logger(StorySpoolingProcessor.name);

  constructor(private readonly storyService: StoryService) {}

  @Process('processSpooling')
  async handleSpoolingJob(job: any) {
    try {
      this.logger.log('Data spooling job started...');

      // Call the data service to initiate the data spooling process
      await this.processSpooledData(job);

      this.logger.log('Data spooling job completed.');
    } catch (error) {
      this.logger.error(`Error occurred during data spooling: ${error}`);
      throw error;
    }
  }

  async processSpooledData(job: any) {
    try {
      await this.storyService.processStories(job.data);
    } catch (error) {
      this.logger.error(`Error processing spooled data: ${error}`);
      throw error;
    }
  }
}
