const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

const validateBodyForNameAndText = (req, res, next) => {
  // Validate req.body
  // Make sure req.body has certain properties { name, text }
}

const validateId = (req, res, next) => {
  const { id } = req.params;
  Hubs.findById(id)
    .then(data => { // If id legit -> data is **object** (the hub) otherwise **undefined**
      console.log(data);
      if (data) {
        // Tack the hub to the req (that way endpoints downstream have the hub already!!!)
        req.hub = data
        // Allow the req/res continue traveling (with the hub attached to req)
        next()
      } else {
        next({ code: 400, message: 'There is no hub with id ' + id })
      }
    })
    .catch(error => {
      console.log(error.message);
      next({ code: 500, message: 'Something crashed and burned' })
    });
};

router.use((req, res, next) => {
  console.log('Inside the hubs router');
  next();
})

// this only runs if the url has /api/hubs in it
router.get('/', (req, res) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hubs',
      });
    });
});

// /api/hubs/:id

router.get('/:id', [validateId], (req, res) => {
  // Hubs.findById(req.params.id)
  //   .then(hub => {
  //     if (hub) {
        res.status(200).json(req.hub);
  //     } else {
  //       res.status(404).json({ message: 'Hub not found' });
  //     }
  //   })
  //   .catch(error => {
  //     // log error to server
  //     console.log(error);
  //     res.status(500).json({
  //       message: 'Error retrieving the hub',
  //     });
  //   });
});

router.post('/', (req, res) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the hub',
      });
    });
});

router.delete('/:id', (req, res) => {
  Hubs.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The hub has been nuked' });
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub',
      });
    });
});

router.put('/:id', (req, res) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub',
      });
    });
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get('/:id/messages', (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
});

// add an endpoint for adding new message to a hub
router.post('/:id/messages', (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
});

router.use((err, req, res, next) => {
  res.status(err.code).json({ message: err.message })
});

module.exports = router;
