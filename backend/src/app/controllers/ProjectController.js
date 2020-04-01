import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore } from 'date-fns';

import Project from '../models/Project';

class ProjectController {
  async index(req, res) {
    const projects = await Project.findAll({
      order: ['date'],
      attributes: ['id', 'title', 'date'],
    });

    return res.json(projects);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, date } = req.body;

    /** Verifica se já existe um projeto com o mesmo nome */
    const projectExists = await Project.findOne({
      where: { title: req.body.title },
    });

    if (projectExists) {
      return res.status(400).json({ error: 'Project already exists.' });
    }
    /** -- */

    /** Verifica se a data para criação ja passou */
    const hourStart = startOfDay(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Creation of a project with a past date is not allowed',
      });
    }

    const project = await Project.create({
      title,
      date: hourStart,
    });

    return res.json(project);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
      title: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /** Verifica se o projeto já existe */
    if (req.body.title) {
      const projectExists = await Project.findOne({
        where: { title: req.body.title },
      });

      if (projectExists) {
        return res.status(400).json({ error: 'Project already exists.' });
      }
    }
    /** */

    /** Verifica se o projeto não existe */
    const project = await Project.findByPk(req.body.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    /** */

    await project.update(req.body);

    const { id, title, date } = project;

    return res.json({
      project: {
        id,
        title,
        date,
      },
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const projectExists = await Project.findByPk(id);

    if (!projectExists) {
      return res.status(400).json({ error: 'Project not found' });
    }

    await Project.destroy({ where: { id } });

    return res.status(204).json();
  }
}

export default new ProjectController();
