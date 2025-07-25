import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const PostRouter = Router();

PostRouter.get('/', PostController.getAll);
PostRouter.get('/:id', PostController.getById);
PostRouter.post('/', PostController.create);
PostRouter.put('/:id', PostController.update);
PostRouter.delete('/:id', PostController.delete);

export default PostRouter;