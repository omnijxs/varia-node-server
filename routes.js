const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');

const Datastore = require('nedb')
const db = new Datastore();

router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id
    db.find({ id: id }, function (err, doc) {
        res.send(doc);
    });
}));

router.get('players', asyncMiddleware(async (req, res) => {
    db.find({}, function (err, docs) {
        res.send(docs);
    });
}));

router.post('/player', asyncMiddleware(async (req, res) => {
    const id = req.body.id;
    const label = req.body.label;
    const model = new Player(id, label);

    db.insert(model);

    res.send(model);
}));

router.put('/player', asyncMiddleware(async (req, res) => {
    const id = req.body.id;
    const label = req.body.label;
    const model = new Player(id, label);

    db.insert(model);

    res.send(model);
}));

router.get('/foobar', asyncMiddleware(async (req, res) => {
    res.send(JSON.stringify('{"foo":"bar"}'));
}));


module.exports = router;