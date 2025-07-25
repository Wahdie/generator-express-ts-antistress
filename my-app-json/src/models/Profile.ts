import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IProfile {
      
        id?: number;
        userId?: number;
        avatar?: string;
        bio?: any;
        phone?: any;
        address?: any;
        birthDate?: Date;
        gender?: 'male' | 'female' | 'other';
        website?: string;
        socialMedia?: any;
}      


class Profile extends Model<IProfile> implements IProfile {

  declare id?: number;
  declare userId?: number;
  declare avatar?: string;
  declare bio?: any;
  declare phone?: any;
  declare address?: any;
  declare birthDate?: Date;
  declare gender?: 'male' | 'female' | 'other';
  declare website?: string;
  declare socialMedia?: any;
}

Profile.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER, unique: true,allowNull: false, references: { model: 'users', key: 'id' },
  },

  avatar: {
    type: DataTypes.STRING, 
  },

  bio: {
    type: DataTypes.TEXT, 
  },

  phone: {
    type: DataTypes.STRING, 
  },

  address: {
    type: DataTypes.JSON, 
  },

  birthDate: {
    type: DataTypes.DATEONLY, 
  },

  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'), 
  },

  website: {
    type: DataTypes.STRING, 
  },

  socialMedia: {
    type: DataTypes.JSON, 
  },

  },
  {
    sequelize,
    modelName: 'Profile',
    timestamps: true,

tableName: 'profiles',

    freezeTableName: true
  }
);

export default Profile;