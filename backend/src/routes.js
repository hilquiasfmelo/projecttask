import { Router } from 'express';

import ProjectController from './app/controllers/ProjectController';
import TaskController from './app/controllers/TaskController';
import ProfileController from './app/controllers/ProfileController';

const routes = new Router();

routes.get('/projects', ProjectController.index);
routes.post('/projects', ProjectController.store);
routes.put('/projects', ProjectController.update);
routes.delete('/projects/:id', ProjectController.delete);

routes.get('/tasks', TaskController.index);
routes.post('/tasks', TaskController.store);
routes.put('/tasks', TaskController.update);
routes.delete('/tasks/:id', TaskController.delete);

routes.get('/profile/:id', ProfileController.index);

export default routes;
