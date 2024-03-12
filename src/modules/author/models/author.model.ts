import { CreationOptional } from 'sequelize';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Comment } from 'src/modules/comment/models/comment.model';
import { Story } from 'src/modules/story/models/story.model';

@Table
export class Author extends Model<Author> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: CreationOptional<number>;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  about: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  karma: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  // Associations to other entities here
  @HasMany(() => Story)
  stories: Story[];

  @HasMany(() => Comment)
  comments: Comment[];
}
