import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Profile from '../models/Profile';

export const UserController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await User.findAll({
        
        include: [
          { model: Post},
          { model: Comment},
          { model: Profile},
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
          { model: Post}, 
          { model: Comment}, 
          { model: Profile}, 
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
      const { name, email, password, role, isActive } = req.body;
       
      await validateRequiredFields({name, email, password });
      
      await validateCreateUniqueFields(
        { email }, 
        User
      );
      
      const newData = await User.create({ name, email, password, role, isActive });
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
      const { name, email, password, role, isActive } = req.body;

      await validateRequiredFields({id, name, email, password  }); 
      
      await validateUpdateUniqueFields(
        Number(id),
        { email }, 
        User
      );
      
      const data = await validateIdExists(User, id, 'User');

      await data.update({ name, email, password, role, isActive });
      
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