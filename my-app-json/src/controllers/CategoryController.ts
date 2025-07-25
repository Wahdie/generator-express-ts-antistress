import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import Category from '../models/Category';
import Post from '../models/Post';

export const CategoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Category.findAll({
        
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
      const data = await Category.findByPk(id, {
        include: [
          { model: Post}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'Category not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { category: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, slug, description, color, isActive } = req.body;
       
      await validateRequiredFields({name, slug });
      
      await validateCreateUniqueFields(
        { name, slug }, 
        Category
      );
      
      const newData = await Category.create({ name, slug, description, color, isActive });
      res.status(201).json({ 
        status: 'success', 
        data: { category: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, slug, description, color, isActive } = req.body;

      await validateRequiredFields({id, name, slug  }); 
      
      await validateUpdateUniqueFields(
        Number(id),
        { name, slug }, 
        Category
      );
      
      const data = await validateIdExists(Category, id, 'Category');

      await data.update({ name, slug, description, color, isActive });
      
      res.json({ 
        status: 'success', 
        data: { category: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(Category, id, 'Category');
      
      await Category.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'Category deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};