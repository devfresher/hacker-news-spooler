import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Story } from 'src/modules/story/models/story.model';
import { Comment } from 'src/modules/comment/models/comment.model';
import { Author } from 'src/modules/author/models/author.model';
import { StoryModule } from './modules/story/story.module';
import { AuthorModule } from './modules/author/author.module';
import { CommentModule } from './modules/comment/comment.module';
import { HttpModule } from '@nestjs/axios';
import { HackerNewsAPIService } from './common/services/hacker-new-api.service';

@Module({
  imports: [
    StoryModule,
    CommentModule,
    AuthorModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        models: [Story, Comment, Author],
      }),
    }),
  ],
  controllers: [],
  providers: [HackerNewsAPIService],
})
export class AppModule {}
