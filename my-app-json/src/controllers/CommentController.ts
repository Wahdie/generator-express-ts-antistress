import { Request, Response, NextFunction } from 'express';
import { validateCreateUniqueFields, validateUpdateUniqueFields } from '../utils/validateUniqueFields';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { validateIdExists } from '../utils/validateIdExists';
import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';

export const CommentController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Comment.findAll({
        
        include: [
          { model: Post},
          { model: User},
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
      const data = await Comment.findByPk(id, {
        include: [
          { model: Post}, 
          { model: User}, 
          { model: Comment}, 
        ]
      });
      if (!data) {
        res.status(404).json({ message: 'Comment not found' })
        return ;
      }
      res.json({ 
        status: 'success', 
        data: { comment: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, userId, parentId, content, isEdited, likesCount, status } = req.body;
       
      await validateRequiredFields({content });
      
      
      const post = await validateIdExists(Post, postId, 'Post') ;
      const user = await validateIdExists(User, userId, 'User') ;
      const comment = await validateIdExists(Comment, parentId, 'Comment') ;
      const newData = await Comment.create({ postId, userId, parentId, content, isEdited, likesCount, status });
      res.status(201).json({ 
        status: 'success', 
        data: { comment: newData } 
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { postId, userId, parentId, content, isEdited, likesCount, status } = req.body;

      await validateRequiredFields({id, content  }); 
      
      
      const post = await validateIdExists(Post, postId, 'Post') ;
      const user = await validateIdExists(User, userId, 'User') ;
      const comment = await validateIdExists(Comment, parentId, 'Comment') ;
      const data = await validateIdExists(Comment, id, 'Comment');

      await data.update({ postId, userId, parentId, content, isEdited, likesCount, status });
      
      res.json({ 
        status: 'success', 
        data: { comment: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await validateRequiredFields({ id });
      const data = await validateIdExists(Comment, id, 'Comment');
      
      await Comment.destroy({ where: { id } });
      res.status(200).json({ 
        status: 'success', 
        message: 'Comment deleted successfully' 
      });
    } catch (err) {
      next(err);
    }
  }
};