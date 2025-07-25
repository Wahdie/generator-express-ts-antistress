import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IPostTags {
      
        id?: number;
        postId?: number;
        tagId?: number;
}      


class PostTags extends Model<IPostTags> implements IPostTags {

  declare id?: number;
  declare postId?: number;
  declare tagId?: number;
}

PostTags.init(
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
    modelName: 'PostTags',
    timestamps: true,

tableName: 'posttagss',

    freezeTableName: true
  }
);

export default PostTags;