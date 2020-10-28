const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

const ourAwesomeMiddleware = (adjective) => (req, res, next) => {
  // modify headers on the res (like helmet)
  // add information to the req object (for the benefit of middlewares downstream)
  // verify and validate info comming in the req (like making sure an id)
  console.log(`this middleware is rather ${adjective}`);
  next();
};

// adding global middlewares with server.use
// the req and the res objects travel through them
server.use(express.json()); // the req now has a body object
server.use(helmet()); // the res now has better headers
server.use(morgan('dev')); // logs things to the console
server.use(ourAwesomeMiddleware('useless'));

// the router is a group of middlewares
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API,</p>
  `);
});

module.exports = server;
