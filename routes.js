const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Model = require('./data/model.js');

const Datastore = require('nedb')
const db = new Datastore();

router.get('/model/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id
    db.find({ id: id }, function (err, doc) {
        res.send(doc);
    });
}));

router.get('/models', asyncMiddleware(async (req, res) => {
    db.find({}, function (err, docs) {
        res.send(docs);
    });
}));

router.post('/model', asyncMiddleware(async (req, res) => {
    const id = req.body.id;
    const label = req.body.label;
    const model = new Model(id, label);

    db.insert(model);

    res.send(model);
}));

module.exports = router;