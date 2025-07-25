import { Router } from 'express';
import { TagController } from '../controllers/TagController';

const TagRouter = Router();

TagRouter.get('/', TagController.getAll);
TagRouter.get('/:id', TagController.getById);
TagRouter.post('/', TagController.create);
TagRouter.put('/:id', TagController.update);
TagRouter.delete('/:id', TagController.delete);

export default TagRouter;