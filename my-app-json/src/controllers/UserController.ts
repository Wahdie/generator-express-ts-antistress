import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import User from '../models/User';
import Profile from '../models/Profile';
import Post from '../models/Post';
import Comment from '../models/Comment';

export const UserController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await User.findAll({
        
        include: [
          { model: Profile},
          { model: Post},
          { model: Comment},
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
      const data = await User.findByPk(id, {
        include: [
          { model: Profile}, 
          { model: Post}, 
          { model: Comment}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'User not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { user: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid, email, username, password, firstName, lastName, age, status, isVerified, lastLoginAt } = req.body;
       
      await validateRequiredFields({uuid, email, username, password, firstName });
      
      await validateCreateUniqueFields(
        { uuid, email, username }, 
        User
      );
      
      const newData = await User.create({ uuid, email, username, password, firstName, lastName, age, status, isVerified, lastLoginAt });
      res.status(201).json({ 
        status: 'success', 
        data: { user: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { uuid, email, username, password, firstName, lastName, age, status, isVerified, lastLoginAt } = req.body;

      await validateRequiredFields({id, uuid, email, username, password, firstName  }); 
      
      await validateUpdateUniqueFields(
        Number(id),
        { uuid, email, username }, 
        User
      );
      
      const data = await validateIdExists(User, id, 'User');

      await data.update({ uuid, email, username, password, firstName, lastName, age, status, isVerified, lastLoginAt });
      
      res.json({ 
        status: 'success', 
        data: { user: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(User, id, 'User');
      
      await User.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'User deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};