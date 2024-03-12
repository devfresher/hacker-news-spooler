import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { AuthorService } from '../author/services/author.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { HttpModule } from '@nestjs/axios';
import { Author } from '../author/models/author.model';

@Module({
  imports: [SequelizeModule.forFeature([Comment, Author]), HttpModule],
  controllers: [CommentController],
  providers: [CommentService, HackerNewsAPIService, AuthorService],
  exports: [CommentService],
})
export class CommentModule {}
