import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { InjectModel } from '@nestjs/sequelize';
import { Story } from '../models/story.model';
import { AuthorService } from 'src/modules/author/services/author.service';
import { Author } from 'src/modules/author/models/author.model';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { Comment } from 'src/modules/comment/models/comment.model';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);
  private readonly includeables = [
    { model: Author, as: 'author' },
    { model: Comment, as: 'comments' },
  ];

  constructor(
    private readonly hackerNewsAPIService: HackerNewsAPIService,
    private readonly authorService: AuthorService,
    private readonly commentService: CommentService,
    @InjectModel(Story) private readonly storyModel: typeof Story,
  ) {}

  async getAll() {
    try {
      const stories = await this.storyModel.findAll({
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
      const story = await this.storyModel.findOne({
        where: { id },
        include: this.includeables,
      });
      return story;
    } catch (error) {
      this.logger.error(`Error retrieving story: ${error}`);
      throw error;
    }
  }

  public async processStories(storyIds: number[]) {
    for (const storyId of storyIds) {
      try {
        await this.createStoryAndOthers(storyId);
      } catch (error) {
        this.logger.error(
          `Error creating story with apiId "${storyId}" in the database: ${error}`,
        );
      }
    }
  }

  private async createStoryAndOthers(storyId: number) {
    const { data: story } = await this.hackerNewsAPIService.fetchItem(storyId);

    const existingStory = await this.storyModel.findOne({
      where: { apiId: storyId },
    });

    if (existingStory) {
      return existingStory;
    }

    if (story.id) {
      if (story.by) {
        const { data: authorData } = await this.hackerNewsAPIService.fetchUser(
          story.by,
        );

        const author = await this.authorService.createAuthor(authorData);

        const storyData = {
          apiId: story.id,
          title: story.title,
          text: story.text,
          url: story.url,
          authorId: author.id,
          createdAt: new Date(story.time * 1000),
        };

        const createdStory = await this.storyModel.create(storyData);
        if (story.kids) {
          for (const commentId of story.kids) {
            await this.commentService.createComment(
              commentId,
              null,
              createdStory.id,
            );
          }
        }

        if (createdStory) {
          this.logger.log(
            `Story "${createdStory.title}" created in the database.`,
          );
        }
      }
    }
  }
}
