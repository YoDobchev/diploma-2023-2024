import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, HasMany } from 'sequelize-typescript';
import Boards from './Boards.model'
import Users from './Users.model';
import Posts from './Posts.model';

@Table({
  tableName: 'Threads',
  schema: 'public',
  timestamps: false,
})

class Threads extends Model<Threads> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare id: string;

  @ForeignKey(() => Boards)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare board_id: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare created_by: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare description: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare createdat: Date;

  @HasMany(() => Posts)
  declare posts: Posts[];
};

export default Threads;
