import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/common/interfaces/hacker-news.interface';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from '../models/author.model';
import { Comment } from 'src/modules/comment/models/comment.model';
import { Story } from 'src/modules/story/models/story.model';

@Injectable()
export class AuthorService {
  private readonly logger = new Logger(AuthorService.name);
  private readonly includeables = [
    { model: Comment, as: 'comments' },
    { model: Story, as: 'stories' },
  ];

  constructor(
    @InjectModel(Author) private readonly authorModel: typeof Author,
  ) {}

  async getAll() {
    try {
      const stories = await this.authorModel.findAll({
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
      const story = await this.authorModel.findOne({
        where: { id },
        include: this.includeables,
      });

      return story;
    } catch (error) {
      this.logger.error(`Error retrieving story: ${error}`);
      throw error;
    }
  }

  public async createAuthor(author: User) {
    if (!author.id) return null;

    const existingAuthor = await this.authorModel.findOne({
      where: { username: author.id },
    });

    if (existingAuthor) {
      return existingAuthor;
    }

    const authorData = {
      username: author.id,
      karma: author.karma,
      about: author.about,
      createdAt: new Date(author.created * 1000),
    };

    // Create the Author record in the database
    return await this.authorModel.create(authorData);
  }
}
