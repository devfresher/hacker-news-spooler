import { Module } from '@nestjs/common';
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './models/author.model';
import { HackerNewsAPIService } from 'src/common/services/hacker-new-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SequelizeModule.forFeature([Author]), HttpModule],
  controllers: [AuthorController],
  providers: [AuthorService, HackerNewsAPIService],
  exports: [AuthorService],
})
export class AuthorModule {}
