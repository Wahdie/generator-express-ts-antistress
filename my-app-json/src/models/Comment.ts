import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IComment {
      
        id?: number;
        postId?: number;
        userId?: number;
        parentId?: number;
        content: any;
        isEdited?: boolean;
        likesCount?: number;
        status?: 'approved' | 'pending' | 'rejected';
}      


class Comment extends Model<IComment> implements IComment {

  declare id?: number;
  declare postId?: number;
  declare userId?: number;
  declare parentId?: number;
  declare content: any;
  declare isEdited?: boolean;
  declare likesCount?: number;
  declare status?: 'approved' | 'pending' | 'rejected';
}

Comment.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  postId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'posts', key: 'id' },
  },

  userId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' },
  },

  parentId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'comments', key: 'id' },
  },

  content: {
    type: DataTypes.TEXT, allowNull: false,
  },

  isEdited: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },

  likesCount: {
    type: DataTypes.INTEGER, defaultValue: 0,
  },

  status: {
    type: DataTypes.ENUM('approved', 'pending', 'rejected'), defaultValue: "pending",
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