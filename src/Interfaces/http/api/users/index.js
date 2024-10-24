const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  async register(server, { container }) {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
