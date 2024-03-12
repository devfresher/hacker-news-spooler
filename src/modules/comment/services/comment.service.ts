import { Injectable } from '@nestjs/common';
import { Item } from 'src/common/interfaces/hacker-news.interface';
import { Comment } from '../models/comment.model';
import { Author } from 'src/modules/author/models/author.model';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { AuthorService } from 'src/modules/author/services/author.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CommentService {
  constructor(
    private readonly hackerNewsAPIService: HackerNewsAPIService,

    private readonly authorService: AuthorService,

    @InjectModel(Comment)
    private readonly CommentModel: typeof Comment,
  ) {}

  public async createComment(comment: Item, author: Author, parentId?: number) {
    const CommentData = {
      apiId: comment.id,
      text: comment.text,
      authorId: author.id,
      storyId: parentId,
      createdAt: new Date(comment.time * 1000),
    };

    // Create the Comment record in the database
    const createdComment = await this.CommentModel.create(CommentData);

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
