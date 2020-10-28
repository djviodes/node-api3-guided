const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// adding global middlewares with server.use
// the req and the res objects travel through them
server.use(express.json()); // the req now has a body object
server.use(helmet()); // the res now has better headers
server.use(morgan('dev')); // logs things to the console
server.use((req, res, next) => {
  console.log('this middleware is rather useless');
  next()
});

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
