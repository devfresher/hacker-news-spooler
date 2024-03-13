import { Controller, Get, Param } from '@nestjs/common';
import { StoryService } from '../services/story.service';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { ScheduleService } from '../services/schedule.service';

@Controller('stories')
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    private readonly commentService: CommentService,
    private readonly scheduleService: ScheduleService,
  ) {}

  @Get('/')
  async getStories() {
    return this.storyService.getAll();
  }

  @Get('/simulate-spooling')
  async simulateSpooling() {
    await this.scheduleService.simulateSpooling();
    return 'Data spooling completed';
  }

  @Get('/:id')
  async getSingle(@Param('id') id: number) {
    return this.storyService.getOne(id);
  }

  @Get('/:id/comments')
  async getComments(@Param('id') id: number) {
    return this.commentService.getAllByStoryId(id);
  }
}
