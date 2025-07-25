import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const UserRouter = Router();

UserRouter.get('/', UserController.getAll);
UserRouter.get('/:id', UserController.getById);
UserRouter.post('/', UserController.create);
UserRouter.put('/:id', UserController.update);
UserRouter.delete('/:id', UserController.delete);

export default UserRouter;