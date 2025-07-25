import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IPost {
      
        id?: number;
        userId?: number;
        categoryId?: number;
        title: string;
        slug: string;
        content: any;
        excerpt?: string;
        featuredImage?: string;
        status?: 'draft' | 'published' | 'archived';
        viewCount?: number;
        likesCount?: number;
        metadata?: any;
        publishedAt?: Date;
}      


class Post extends Model<IPost> implements IPost {

  declare id?: number;
  declare userId?: number;
  declare categoryId?: number;
  declare title: string;
  declare slug: string;
  declare content: any;
  declare excerpt?: string;
  declare featuredImage?: string;
  declare status?: 'draft' | 'published' | 'archived';
  declare viewCount?: number;
  declare likesCount?: number;
  declare metadata?: any;
  declare publishedAt?: Date;
}

Post.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' },
  },

  categoryId: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'categorys', key: 'id' },
  },

  title: {
    type: DataTypes.STRING, allowNull: false,
  },

  slug: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },

  content: {
    type: DataTypes.TEXT, allowNull: false,
  },

  excerpt: {
    type: DataTypes.STRING, 
  },

  featuredImage: {
    type: DataTypes.STRING, 
  },

  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: "draft",
  },

  viewCount: {
    type: DataTypes.INTEGER, defaultValue: 0,
  },

  likesCount: {
    type: DataTypes.INTEGER, defaultValue: 0,
  },

  metadata: {
    type: DataTypes.JSON, 
  },

  publishedAt: {
    type: DataTypes.DATE, 
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