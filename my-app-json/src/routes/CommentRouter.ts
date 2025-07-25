import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';

const CommentRouter = Router();

CommentRouter.get('/', CommentController.getAll);
CommentRouter.get('/:id', CommentController.getById);
CommentRouter.post('/', CommentController.create);
CommentRouter.put('/:id', CommentController.update);
CommentRouter.delete('/:id', CommentController.delete);

export default CommentRouter;