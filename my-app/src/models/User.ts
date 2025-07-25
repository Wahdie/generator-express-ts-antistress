import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IUser {
      
        id?: number;
        name: string;
        email: string;
        password: string;
        role?: 'admin' | 'editor' | 'user';
        isActive?: boolean;
}      


class User extends Model<IUser> implements IUser {

  declare id?: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role?: 'admin' | 'editor' | 'user';
  declare isActive?: boolean;
}

User.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING, allowNull: false,
  },

  email: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },

  password: {
    type: DataTypes.STRING, allowNull: false,
  },

  role: {
    type: DataTypes.ENUM('admin', 'editor', 'user'), defaultValue: "user",
  },

  isActive: {
    type: DataTypes.BOOLEAN, defaultValue: true,
  },

  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,

tableName: 'users',

    freezeTableName: true
  }
);

export default User;