const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

const ourAwesomeMiddleware = (adjective) => (req, res, next) => {
  // You can modify headers on the res (like helmet does)
  res.append('X-Lambda', 'Web-36');
  // Or you can add information to the req object (for the benefit of middlewares downstream)
  req.lambda = 'Web 36 is the best cohort';
  // OR you can verify and validate info coming in the req (like making sure an :id exists)
  // Make sure the body of the request has certain properties...
  console.log(`This middleware is rather ${adjective}`);
  next();
}

const moodyGateKeeper = (req, res, next) => {
  // Get seconds of Unix time by using `new Date().getSeconds()`
  // If the second multiple of 3, respond with a 403 and a "not allowed" message
  // Otherwise, call next to allow the request to proceed...
  if (new Date().getSeconds() % 33 === 0) {
    res.status(403).json({
      message: 'YOU SHALL NOT PASS!!!'
    });
  } else {
    next();
  }
};

// Adding global middlewares with server.use
// The req and res objects travel through them
server.use(express.json()); // The req now has a body object
server.use(helmet()); // The res now has better headers
server.use(morgan('dev')); // Logger middleware
server.use(ourAwesomeMiddleware('AWESOME'));
server.use(moodyGateKeeper);

// The router is a group of middlewares
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

server.use((error, req, res, next) => {
  res.status(500).json({
    message: error
  });
});

module.exports = server;
