import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface ICategory {
      
        id?: number;
        name: string;
        slug: string;
        description?: any;
        color?: any;
        isActive?: boolean;
}      


class Category extends Model<ICategory> implements ICategory {

  declare id?: number;
  declare name: string;
  declare slug: string;
  declare description?: any;
  declare color?: any;
  declare isActive?: boolean;
}

Category.init(
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

  isActive: {
    type: DataTypes.BOOLEAN, defaultValue: true,
  },

  },
  {
    sequelize,
    modelName: 'Category',
    timestamps: true,

tableName: 'categorys',

    freezeTableName: true
  }
);

export default Category;