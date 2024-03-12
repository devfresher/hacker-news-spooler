import { CreationOptional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Author } from '../../author/models/author.model';
import { Story } from 'src/modules/story/models/story.model';

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: CreationOptional<number>;

  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  apiId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @ForeignKey(() => Story)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  storyId: number;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.INTEGER,
  })
  parentId?: number;

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

  @BelongsTo(() => Comment)
  parent: Comment;

  @HasMany(() => Comment)
  children: Comment[];
}
