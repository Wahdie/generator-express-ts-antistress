import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import PostTags from '../models/PostTags';
import Post from '../models/Post';
import Tag from '../models/Tag';

export const PostTagsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await PostTags.findAll({
        
        include: [
          { model: Post},
          { model: Tag},
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
      const data = await PostTags.findByPk(id, {
        include: [
          { model: Post}, 
          { model: Tag}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'PostTags not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { postTags: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, tagId } = req.body;
      
      
      
      const post = await validateIdExists(Post, postId, 'Post') ;
      const tag = await validateIdExists(Tag, tagId, 'Tag') ;
      const newData = await PostTags.create({ postId, tagId });
      res.status(201).json({ 
        status: 'success', 
        data: { postTags: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { postId, tagId } = req.body;

      await validateRequiredFields({id,  }); 
      
      
      const post = await validateIdExists(Post, postId, 'Post') ;
      const tag = await validateIdExists(Tag, tagId, 'Tag') ;
      const data = await validateIdExists(PostTags, id, 'PostTags');

      await data.update({ postId, tagId });
      
      res.json({ 
        status: 'success', 
        data: { postTags: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(PostTags, id, 'PostTags');
      
      await PostTags.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'PostTags deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};