module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'projecttask',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
