import { Controller, Get, Param } from '@nestjs/common';
import { StoryService } from '../services/story.service';

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('/')
  async getStories() {
    return this.storyService.getAll();
  }

  @Get('/:id')
  async getSingle(@Param('id') id: number) {
    return this.storyService.getOne(id);
  }
}
