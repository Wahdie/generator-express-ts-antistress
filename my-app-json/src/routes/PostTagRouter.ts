import { Router } from 'express';
import { PostTagController } from '../controllers/PostTagController';

const PostTagRouter = Router();

PostTagRouter.get('/', PostTagController.getAll);
PostTagRouter.get('/:id', PostTagController.getById);
PostTagRouter.post('/', PostTagController.create);
PostTagRouter.put('/:id', PostTagController.update);
PostTagRouter.delete('/:id', PostTagController.delete);

export default PostTagRouter;