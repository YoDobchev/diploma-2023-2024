import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

interface UserAttributes {
  username: string;
  password: string;
}

@Table({
  tableName: 'Users',
  schema: 'public',
  timestamps: false,
})

class Users extends Model<Users, UserAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare password: string;
};

export default Users;