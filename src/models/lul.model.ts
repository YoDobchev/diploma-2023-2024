import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'lul',
  schema: 'public',
  timestamps: false,
})
export default class Lul extends Model<Lul> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare shekel: number;
}
console.log("lololo")