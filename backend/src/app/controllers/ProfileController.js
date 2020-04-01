import Task from '../models/Task';

class ProfileController {
  async index(req, res) {
    const { id } = req.params;

    if (req.params.id) {
      const projectExists = await Task.findOne({
        where: { project_id: req.params.id },
      });

      if (!projectExists) {
        return res.status(400).json({ error: 'Project not exist.' });
      }
    }

    const tasks = await Task.findAll({
      where: { project_id: id },
      attributes: ['id', 'title', 'description', 'project_id'],
    });

    return res.json(tasks);
  }
}

export default new ProfileController();
