import { Injectable, Logger } from '@nestjs/common';
import { Comment } from '../models/comment.model';
import { Author } from 'src/modules/author/models/author.model';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { AuthorService } from 'src/modules/author/services/author.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  private readonly includeables = [
    { model: Author, as: 'author' },
    { model: Comment, as: 'parent' },
    { model: Comment, as: 'children' },
  ];

  constructor(
    private readonly hackerNewsAPIService: HackerNewsAPIService,

    private readonly authorService: AuthorService,

    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
  ) {}

  async getAll() {
    try {
      const stories = await this.commentModel.findAll({
        include: this.includeables,
      });
      return stories;
    } catch (error) {
      this.logger.error(`Error retrieving stories: ${error}`);
      throw error;
    }
  }

  async getAllByStoryId(storyId: number) {
    try {
      const comments = await this.commentModel.findAll({
        where: { storyId },
        include: this.includeables,
      });
      return comments;
    } catch (error) {
      this.logger.error(`Error retrieving comments: ${error}`);
      throw error;
    }
  }

  async getOne(id: number) {
    try {
      const story = await this.commentModel.findOne({
        where: { id },
        include: this.includeables,
      });
      return story;
    } catch (error) {
      this.logger.error(`Error retrieving story: ${error}`);
      throw error;
    }
  }

  public async processComments(
    commentIds: number[],
    parentId?: number,
    storyId?: number,
  ) {
    for (const commentId of commentIds) {
      const { data: comment } =
        await this.hackerNewsAPIService.fetchItem(commentId);

      const existingComment = await this.commentModel.findOne({
        where: { apiId: commentId },
      });

      if (existingComment) {
        return existingComment;
      }

      if (comment.id) {
        if (comment.by) {
          const author = await this.authorService.processAuthor(comment.by);

          const CommentData = {
            apiId: comment.id,
            text: comment.text,
            authorId: author.id,
            storyId,
            parentId,
            createdAt: new Date(comment.time * 1000),
          };
          const createdComment = await this.commentModel.create(CommentData);

          if (comment.kids) {
            await this.processComments(comment.kids, createdComment.id);
          }

          if (createdComment) {
            this.logger.log(
              `New comment created: ${createdComment.id} created in the database.`,
            );
          }
        }
      }
    }
  }
}
