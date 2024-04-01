import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import Threads from './Threads.model';
import Users from './Users.model';
import Images from './Images.model';

@Table({
  tableName: 'Posts',
  schema: 'public',
  timestamps: false,
})

class Posts extends Model<Posts> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare id: string;

  @ForeignKey(() => Threads)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare thread_id: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare text: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare created_by: string;

  @ForeignKey(() => Posts)
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare reply_to_id: string;

  @Column({ 
    type: DataType.DATE,
    allowNull: true
  })
  declare createdat: Date;

  @HasMany(() => Images)
  declare images: Images[];

  @BelongsTo(() => Threads)
  declare thread: Threads;
};
  
  
export default Posts;