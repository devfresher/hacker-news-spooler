import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { Item } from 'src/common/interfaces/hacker-news.interface';
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
    @InjectQueue('storySpooling') private readonly storySpoolingQueue: Queue,
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

  async spoolData() {
    try {
      const { data: stories } =
        await this.hackerNewsAPIService.fetchTopStories();

      this.storySpoolingQueue.add({
        data: stories,
      });

      this.processStories(stories);
    } catch (error) {
      this.logger.error(`Error occurred during data spooling: ${error}`);
      throw error;
    }
  }

  private async processStories(stories: Item[]) {
    for (const story of stories) {
      try {
        const { data: authorData } = await this.hackerNewsAPIService.fetchUser(
          story.by,
        );
        const author = await this.authorService.createAuthor(authorData);
        await this.createStoryAndComments(story, author);

        this.logger.log(`Story "${story.title}" created in the database.`);
      } catch (error) {
        this.logger.error(
          `Error creating story "${story.title}" in the database: ${error}`,
        );
      }
    }
  }

  private async createStoryAndComments(story: Item, author: Author) {
    const existingStory = await this.storyModel.findOne({
      where: { apiId: story.id },
    });

    if (existingStory) {
      return existingStory;
    }

    const storyData = {
      apiId: story.id,
      title: story.title,
      text: story.text,
      url: story.url,
      authorId: author.id,
      createdAt: new Date(story.time * 1000),
    };

    // Create the story record in the database
    const createdStory = await this.storyModel.create(storyData);

    // Recursively process each comment (kid) associated with the story
    if (story.kids) {
      for (const commentId of story.kids) {
        const { data: commentData } =
          await this.hackerNewsAPIService.fetchItem(commentId);

        const { data: authorData } = await this.hackerNewsAPIService.fetchUser(
          commentData.by,
        );
        const author = await this.authorService.createAuthor(authorData);

        // Create the comment record in the database
        await this.commentService.createComment(
          commentData,
          author,
          createdStory.id,
        );
      }
    }
  }
}
