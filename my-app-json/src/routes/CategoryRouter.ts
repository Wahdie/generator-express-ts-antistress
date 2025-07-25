import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const CategoryRouter = Router();

CategoryRouter.get('/', CategoryController.getAll);
CategoryRouter.get('/:id', CategoryController.getById);
CategoryRouter.post('/', CategoryController.create);
CategoryRouter.put('/:id', CategoryController.update);
CategoryRouter.delete('/:id', CategoryController.delete);

export default CategoryRouter;