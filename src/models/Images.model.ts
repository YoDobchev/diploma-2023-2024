import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Posts from './Posts.model';

@Table({
    tableName: 'Images',
    schema: 'public',
    timestamps: false,
})

class Images extends Model<Images> {
    @PrimaryKey
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    declare id: string;

    @ForeignKey(() => Posts)
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    declare post_id: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: true
    })
    declare path: string;

    @Column({ 
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false
    })
    declare filters: number[];

    @BelongsTo(() => Posts)
    declare post: Posts;
}
 
export default Images;