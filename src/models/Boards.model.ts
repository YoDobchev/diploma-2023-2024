import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'Boards',
  schema: 'public',
  timestamps: false,
})

class Boards extends Model<Boards> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare description: string;
}


export default Boards;