import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from '../services/comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/')
  async getAll() {
    return await this.commentService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.commentService.getOne(id);
  }
}
