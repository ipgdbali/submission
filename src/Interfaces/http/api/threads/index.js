const routes = require('./routes');
const ThreadsHandler = require('./handler');

module.exports = {
  name : 'threads',
  async register(server, { container }) {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};
