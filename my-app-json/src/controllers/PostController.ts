import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import Post from '../models/Post';
import User from '../models/User';
import Category from '../models/Category';
import Comment from '../models/Comment';
import Tag from '../models/Tag';

export const PostController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Post.findAll({
        
        include: [
          { model: User},
          { model: Category},
          { model: Comment},
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
      const data = await Post.findByPk(id, {
        include: [
          { model: User}, 
          { model: Category}, 
          { model: Comment}, 
          { model: Tag}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'Post not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { post: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, categoryId, title, slug, content, excerpt, featuredImage, status, viewCount, likesCount, metadata, publishedAt } = req.body;
       
      await validateRequiredFields({title, slug, content });
      
      await validateCreateUniqueFields(
        { slug }, 
        Post
      );
      
      const user = await validateIdExists(User, userId, 'User') ;
      const category = await validateIdExists(Category, categoryId, 'Category') ;
      const newData = await Post.create({ userId, categoryId, title, slug, content, excerpt, featuredImage, status, viewCount, likesCount, metadata, publishedAt });
      res.status(201).json({ 
        status: 'success', 
        data: { post: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId, categoryId, title, slug, content, excerpt, featuredImage, status, viewCount, likesCount, metadata, publishedAt } = req.body;

      await validateRequiredFields({id, title, slug, content  }); 
      
      await validateUpdateUniqueFields(
        Number(id),
        { slug }, 
        Post
      );
      
      const user = await validateIdExists(User, userId, 'User') ;
      const category = await validateIdExists(Category, categoryId, 'Category') ;
      const data = await validateIdExists(Post, id, 'Post');

      await data.update({ userId, categoryId, title, slug, content, excerpt, featuredImage, status, viewCount, likesCount, metadata, publishedAt });
      
      res.json({ 
        status: 'success', 
        data: { post: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(Post, id, 'Post');
      
      await Post.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'Post deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};