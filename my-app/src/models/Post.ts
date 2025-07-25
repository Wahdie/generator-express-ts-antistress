import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IPost {
      
        id?: number;
        title: string;
        content: any;
        photo?: string;
        publishedAt?: Date;
        userId?: number;
}      


class Post extends Model<IPost> implements IPost {

  declare id?: number;
  declare title: string;
  declare content: any;
  declare photo?: string;
  declare publishedAt?: Date;
  declare userId?: number;
}

Post.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING, allowNull: false,
  },

  content: {
    type: DataTypes.TEXT, allowNull: false,
  },

  photo: {
    type: DataTypes.STRING, 
  },

  publishedAt: {
    type: DataTypes.DATE, 
  },

  userId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' },
  },

  },
  {
    sequelize,
    modelName: 'Post',
    timestamps: true,

tableName: 'posts',

    freezeTableName: true
  }
);

export default Post;