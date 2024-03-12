import { Injectable } from '@nestjs/common';
import { User } from 'src/common/interfaces/hacker-news.interface';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from '../models/author.model';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author) private readonly AuthorModel: typeof Author,
  ) {}

  public async createAuthor(author: User) {
    const existingAuthor = await this.AuthorModel.findOne({
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
    return await this.AuthorModel.create(authorData);
  }
}
