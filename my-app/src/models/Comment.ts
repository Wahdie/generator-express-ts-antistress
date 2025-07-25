import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IComment {
      
        id?: number;
        content: string;
        postId?: number;
        userId?: number;
}      


class Comment extends Model<IComment> implements IComment {

  declare id?: number;
  declare content: string;
  declare postId?: number;
  declare userId?: number;
}

Comment.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  content: {
    type: DataTypes.STRING, allowNull: false,
  },

  postId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'posts', key: 'id' },
  },

  userId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' },
  },

  },
  {
    sequelize,
    modelName: 'Comment',
    timestamps: true,

tableName: 'comments',

    freezeTableName: true
  }
);

export default Comment;