import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IMedia {
      
        id?: number;
        filename: string;
        originalName: string;
        mimeType: string;
        size: bigint;
        path: string;
        url: string;
        alt?: string;
        caption?: any;
        metadata?: any;
        isPublic?: boolean;
        uploadedBy?: number;
}      


class Media extends Model<IMedia> implements IMedia {

  declare id?: number;
  declare filename: string;
  declare originalName: string;
  declare mimeType: string;
  declare size: bigint;
  declare path: string;
  declare url: string;
  declare alt?: string;
  declare caption?: any;
  declare metadata?: any;
  declare isPublic?: boolean;
  declare uploadedBy?: number;
}

Media.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  filename: {
    type: DataTypes.STRING, allowNull: false,
  },

  originalName: {
    type: DataTypes.STRING, allowNull: false,
  },

  mimeType: {
    type: DataTypes.STRING, allowNull: false,
  },

  size: {
    type: DataTypes.BIGINT, allowNull: false,
  },

  path: {
    type: DataTypes.STRING, allowNull: false,
  },

  url: {
    type: DataTypes.STRING, allowNull: false,
  },

  alt: {
    type: DataTypes.STRING, 
  },

  caption: {
    type: DataTypes.TEXT, 
  },

  metadata: {
    type: DataTypes.JSON, 
  },

  isPublic: {
    type: DataTypes.BOOLEAN, defaultValue: true,
  },

  uploadedBy: {
    type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' },
  },

  },
  {
    sequelize,
    modelName: 'Media',
    timestamps: true,

tableName: 'medias',

    freezeTableName: true
  }
);

export default Media;