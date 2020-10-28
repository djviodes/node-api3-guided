const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

const ourAwesomeMiddleware = (adjective) => (req, res, next) => {
  // modify headers on the res (like helmet)
  res.append('X-Lambda', 'web-35');
  // add information to the req object (for the benefit of middlewares downstream)
  req.lambda = 'Web 35 rulez';
  // verify and validate info comming in the req (like making sure an :id exists)
  // make sure the body of the request has certain properties...
  console.log(`this middleware is rather ${adjective}`);
  next();
};

const moodyGateKeeper = (req, res, next) => {
  // get seconds of Unix time `new Date().getSeconds()`
  // if the seconds multiple of 3, respond with a 403 and a "not allowed" message
  // otherwise call next to allow the request to proceed...
  if (new Date().getSeconds() % 3 === 0) {
    res.status(403).json({ message: 'Sorry, you shall not pass' });
  } else {
    next();
  }
};

// adding global middlewares with server.use
// the req and the res objects travel through them
server.use(express.json()); // the req now has a body object
server.use(helmet()); // the res now has better headers
server.use(morgan('dev')); // logs things to the console
server.use(ourAwesomeMiddleware('useless')); // configurable console.log
server.use(moodyGateKeeper);

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
