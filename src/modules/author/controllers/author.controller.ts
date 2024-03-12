import { Controller, Get, Param } from '@nestjs/common';
import { AuthorService } from '../services/author.service';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get('/')
  async getAll() {
    return await this.authorService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.authorService.getOne(id);
  }
}
