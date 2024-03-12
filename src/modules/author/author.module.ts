import { Module } from '@nestjs/common';
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './models/author.model';

@Module({
  imports: [SequelizeModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
