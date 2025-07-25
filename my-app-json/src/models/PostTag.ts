import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IPostTag {
      
        id?: number;
        postId?: number;
        tagId?: number;
}      


class PostTag extends Model<IPostTag> implements IPostTag {

  declare id?: number;
  declare postId?: number;
  declare tagId?: number;
}

PostTag.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  postId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'posts', key: 'id' },
  },

  tagId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'tags', key: 'id' },
  },

  },
  {
    sequelize,
    modelName: 'PostTag',
    timestamps: true,

tableName: 'posttags',

    freezeTableName: true
  }
);

export default PostTag;