import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IUser {
      
        id?: number;
        uuid: string;
        email: any;
        username: string;
        password: string;
        firstName: string;
        lastName?: string;
        age?: number;
        status?: 'active' | 'inactive' | 'suspended';
        isVerified?: boolean;
        lastLoginAt?: Date;
}      


class User extends Model<IUser> implements IUser {

  declare id?: number;
  declare uuid: string;
  declare email: any;
  declare username: string;
  declare password: string;
  declare firstName: string;
  declare lastName?: string;
  declare age?: number;
  declare status?: 'active' | 'inactive' | 'suspended';
  declare isVerified?: boolean;
  declare lastLoginAt?: Date;
}

User.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  uuid: {
    type: DataTypes.UUID, allowNull: false,unique: true,
  },

  email: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },

  username: {
    type: DataTypes.STRING, allowNull: false,unique: true,
  },

  password: {
    type: DataTypes.STRING, allowNull: false,
  },

  firstName: {
    type: DataTypes.STRING, allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING, 
  },

  age: {
    type: DataTypes.INTEGER, 
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: "active",
  },

  isVerified: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },

  lastLoginAt: {
    type: DataTypes.DATE, 
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