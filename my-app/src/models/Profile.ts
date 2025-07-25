import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IProfile {
      
        id?: number;
        bio?: string;
        website?: string;
        userId?: number;
}      


class Profile extends Model<IProfile> implements IProfile {

  declare id?: number;
  declare bio?: string;
  declare website?: string;
  declare userId?: number;
}

Profile.init(
  {
  id: {
    type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true,
  },

  bio: {
    type: DataTypes.STRING, 
  },

  website: {
    type: DataTypes.STRING, 
  },

  userId: {
    type: DataTypes.INTEGER, unique: true,allowNull: false, references: { model: 'users', key: 'id' },
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