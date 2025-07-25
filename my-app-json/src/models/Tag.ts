import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface ITag {
      
        id?: number;
        name: string;
        slug: string;
        description?: any;
        color?: any;
        usageCount?: number;
}      


class Tag extends Model<ITag> implements ITag {

  declare id?: number;
  declare name: string;
  declare slug: string;
  declare description?: any;
  declare color?: any;
  declare usageCount?: number;
}

Tag.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },

  slug: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },

  description: {
    type: DataTypes.TEXT, 
  },

  color: {
    type: DataTypes.STRING, 
  },

  usageCount: {
    type: DataTypes.INTEGER, defaultValue: 0,
  },

  },
  {
    sequelize,
    modelName: 'Tag',
    timestamps: true,

tableName: 'tags',

    freezeTableName: true
  }
);

export default Tag;