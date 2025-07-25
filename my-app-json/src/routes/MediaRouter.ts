import { Router } from 'express';
import { MediaController } from '../controllers/MediaController';

const MediaRouter = Router();

MediaRouter.get('/', MediaController.getAll);
MediaRouter.get('/:id', MediaController.getById);
MediaRouter.post('/', MediaController.create);
MediaRouter.put('/:id', MediaController.update);
MediaRouter.delete('/:id', MediaController.delete);

export default MediaRouter;