const express = require('express');
const path = require('path');
const db = require('../database/index.js');

const app = express();

app.use(express.static(path.join(__dirname, '/../public')));

app.get('/booking/core/listingId/:listingId', (req, res) => {
  db.getCoreData(req.params.listingId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

// structure: http://localhost:3001/booking/availability/listingid/3?start_date=2018-07-01&end_date=2018-09-28
app.get('/booking/availability/listingId/:listingId', (req, res) => {
  db.getReservationData(req.params.listingId, req.query.start_date, req.query.end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

// structure: http://localhost:3001/booking/pricing/listingid/3?start_date=2018-07-01&end_date=2018-09-28
app.get('/booking/pricing/listingId/:listingId', (req, res) => {
  db.getPricingData(req.params.listingId, req.query.start_date, req.query.end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

module.exports = app;