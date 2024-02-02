import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import Boards from './Boards.model'
import Users from './Users.model';

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

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare createdat: Date;
}
  
  
export default Threads;