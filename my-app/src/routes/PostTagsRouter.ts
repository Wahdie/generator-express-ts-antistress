import { Router } from 'express';
import { PostTagsController } from '../controllers/PostTagsController';

const PostTagsRouter = Router();

PostTagsRouter.get('/', PostTagsController.getAll);
PostTagsRouter.get('/:id', PostTagsController.getById);
PostTagsRouter.post('/', PostTagsController.create);
PostTagsRouter.put('/:id', PostTagsController.update);
PostTagsRouter.delete('/:id', PostTagsController.delete);

export default PostTagsRouter;