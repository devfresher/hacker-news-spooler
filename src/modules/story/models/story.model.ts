import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Author } from '../../author/models/author.model';
import { CreationOptional } from 'sequelize';
import { Comment } from 'src/modules/comment/models/comment.model';

@Table({ tableName: 'stories' })
export class Story extends Model<Story> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: CreationOptional<number>;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  apiId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  text: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  score: number;

  @Column({
    type: DataType.STRING,
  })
  category: string;

  @ForeignKey(() => Author)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  authorId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  // Associations to other entities here
  @BelongsTo(() => Author)
  author: Author;

  @HasMany(() => Comment)
  comments: Comment[];
}
