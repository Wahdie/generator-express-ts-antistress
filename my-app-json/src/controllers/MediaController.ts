import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import Media from '../models/Media';
import User from '../models/User';

export const MediaController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Media.findAll({
        
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
      const data = await Media.findByPk(id, {
        include: [
          { model: User}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'Media not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { media: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename, originalName, mimeType, size, path, url, alt, caption, metadata, isPublic, uploadedBy } = req.body;
       
      await validateRequiredFields({filename, originalName, mimeType, size, path, url });
      
      
      const user = await validateIdExists(User, uploadedBy, 'User') ;
      const newData = await Media.create({ filename, originalName, mimeType, size, path, url, alt, caption, metadata, isPublic, uploadedBy });
      res.status(201).json({ 
        status: 'success', 
        data: { media: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { filename, originalName, mimeType, size, path, url, alt, caption, metadata, isPublic, uploadedBy } = req.body;

      await validateRequiredFields({id, filename, originalName, mimeType, size, path, url  }); 
      
      
      const user = await validateIdExists(User, uploadedBy, 'User') ;
      const data = await validateIdExists(Media, id, 'Media');

      await data.update({ filename, originalName, mimeType, size, path, url, alt, caption, metadata, isPublic, uploadedBy });
      
      res.json({ 
        status: 'success', 
        data: { media: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(Media, id, 'Media');
      
      await Media.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'Media deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};