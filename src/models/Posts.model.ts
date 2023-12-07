import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import Threads from './Boards.model'

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
        allowNull: true
    })
    declare image: string;
    
    @Column({ 
        type: DataType.STRING,
        allowNull: false
    })
    declare text: string;
}
  
  
export default Posts;