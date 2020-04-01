import * as Yup from 'yup';
import Project from '../models/Project';
import Task from '../models/Task';

class TaskController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const tasks = await Task.findAll({
      attributes: ['id', 'title', 'description'],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'date'],
        },
      ],
    });

    return res.json(tasks);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      project_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { project_id, title, description } = req.body;

    /** Verifica se o projeto não existe */
    const project = await Project.findOne({
      where: { id: project_id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    /** */

    /** Verifica se a tarefa já existe */
    if (req.body.title) {
      const taskExistes = await Task.findOne({
        where: { title: req.body.title },
      });

      if (taskExistes) {
        return res.status(400).json({ error: 'Task already exists.' });
      }
    }
    /** */

    const task = await Task.create({
      project_id,
      title,
      description,
    });

    return res.json(task);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string(),
      description: Yup.string(),
      project_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** Verifica se a tarefa já existe */
    if (req.body.title) {
      const taskExists = await Task.findOne({
        where: { title: req.body.title },
      });

      if (taskExists) {
        return res.status(400).json({ error: 'Task already exists.' });
      }
    }
    /** */

    /** Verifica se a tarefa não existe */
    const task = await Task.findByPk(req.body.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    /** */

    /** Verifica se existe projeto para a tarefa */
    if (req.body.project_id) {
      const projectExistInTask = await Task.findOne({
        where: { id: req.body.project_id },
      });

      if (!projectExistInTask) {
        return res
          .status(400)
          .json({ error: 'Not exists project for this task.' });
      }
    }
    /** */

    await task.update(req.body);

    const { id, title, description, project_id } = task;

    return res.json({
      task: {
        id,
        title,
        description,
        project_id,
      },
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const taskExists = await Task.findByPk(id);

    if (!taskExists) {
      return res.status(400).json({ error: 'Task not found' });
    }

    await Task.destroy({ where: { id } });

    return res.status(204).json();
  }
}

export default new TaskController();
