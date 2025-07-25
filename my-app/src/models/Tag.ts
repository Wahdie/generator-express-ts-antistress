import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface ITag {
      
        id?: number;
        name: string;
}      


class Tag extends Model<ITag> implements ITag {

  declare id?: number;
  declare name: string;
}

Tag.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING, allowNull: false,unique: true,
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