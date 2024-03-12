import { Injectable, Logger } from '@nestjs/common';
import { Item } from 'src/common/interfaces/hacker-news.interface';
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

  public async createComment(comment: Item, author: Author, parentId?: number) {
    const existingComment = await this.commentModel.findOne({
      where: { apiId: comment.id },
    });

    if (existingComment) {
      return existingComment;
    }

    const CommentData = {
      apiId: comment.id,
      text: comment.text,
      authorId: author.id,
      storyId: parentId,
      createdAt: new Date(comment.time * 1000),
    };

    // Create the Comment record in the database
    const createdComment = await this.commentModel.create(CommentData);

    // Recursively process each comment (kid) associated with the Comment
    if (comment.kids) {
      for (const commentId of comment.kids) {
        const { data: commentData } =
          await this.hackerNewsAPIService.fetchItem(commentId);

        const { data: authorData } = await this.hackerNewsAPIService.fetchUser(
          commentData.by,
        );
        const author = await this.authorService.createAuthor(authorData);

        // Create the comment record in the database
        await this.createComment(commentData, author, createdComment.id);
      }
    }
  }
}
