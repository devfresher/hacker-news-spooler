import { Module } from '@nestjs/common';
import { StoryController } from './controllers/story.controller';
import { StoryService } from './services/story.service';
import { BullModule } from '@nestjs/bull';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { AuthorService } from '../author/services/author.service';
import { CommentService } from '../comment/services/comment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Story } from './models/story.model';
import { HttpModule } from '@nestjs/axios';
import { Author } from '../author/models/author.model';
import { Comment } from '../comment/models/comment.model';
import { QueueService } from './services/queue.service';
import { ScheduleService } from './services/schedule.service';
import { StorySpoolingProcessor } from './jobs/story.processor';

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([Story, Author, Comment]),
    BullModule.registerQueue({
      name: 'story-spooling',
    }),
  ],
  controllers: [StoryController],
  providers: [
    StoryService,
    HackerNewsAPIService,
    AuthorService,
    CommentService,
    StorySpoolingProcessor,
    QueueService,
    ScheduleService,
  ],
  exports: [StoryService],
})
export class StoryModule {}
