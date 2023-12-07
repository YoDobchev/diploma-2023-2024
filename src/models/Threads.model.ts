import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import Boards from './Boards.model'

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
}
  
  
export default Threads;