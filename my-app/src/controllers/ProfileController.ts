import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import Profile from '../models/Profile';
import User from '../models/User';

export const ProfileController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Profile.findAll({
        
        include: [
          { model: User},
        ]
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await Profile.findByPk(id, {
        include: [
          { model: User}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'Profile not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { profile: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bio, website, userId } = req.body;
      
      
      await validateCreateUniqueFields(
        { userId }, 
        Profile
      );
      
      const user = await validateIdExists(User, userId, 'User') ;
      const newData = await Profile.create({ bio, website, userId });
      res.status(201).json({ 
        status: 'success', 
        data: { profile: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { bio, website, userId } = req.body;

      await validateRequiredFields({id,  }); 
      
      await validateUpdateUniqueFields(
        Number(id),
        { userId }, 
        Profile
      );
      
      const user = await validateIdExists(User, userId, 'User') ;
      const data = await validateIdExists(Profile, id, 'Profile');

      await data.update({ bio, website, userId });
      
      res.json({ 
        status: 'success', 
        data: { profile: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(Profile, id, 'Profile');
      
      await Profile.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'Profile deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};