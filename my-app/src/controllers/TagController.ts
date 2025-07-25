import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import Tag from '../models/Tag';
import Post from '../models/Post';

export const TagController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Tag.findAll({
        
        include: [
          { model: Post},
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
      const data = await Tag.findByPk(id, {
        include: [
          { model: Post}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'Tag not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { tag: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
       
      await validateRequiredFields({name });
      
      await validateCreateUniqueFields(
        { name }, 
        Tag
      );
      
      const newData = await Tag.create({ name });
      res.status(201).json({ 
        status: 'success', 
        data: { tag: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await validateRequiredFields({id, name  }); 
      
      await validateUpdateUniqueFields(
        Number(id),
        { name }, 
        Tag
      );
      
      const data = await validateIdExists(Tag, id, 'Tag');

      await data.update({ name });
      
      res.json({ 
        status: 'success', 
        data: { tag: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(Tag, id, 'Tag');
      
      await Tag.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'Tag deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};