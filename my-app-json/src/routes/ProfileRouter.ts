import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';

const ProfileRouter = Router();

ProfileRouter.get('/', ProfileController.getAll);
ProfileRouter.get('/:id', ProfileController.getById);
ProfileRouter.post('/', ProfileController.create);
ProfileRouter.put('/:id', ProfileController.update);
ProfileRouter.delete('/:id', ProfileController.delete);

export default ProfileRouter;