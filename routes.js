const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');

const Datastore = require('nedb')
let db = new Datastore();

router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id
    
    db.find({ uuid: id }, function (err, doc) {
        res.send(doc);
    });
}));

router.get('/players', asyncMiddleware(async (req, res) => {
    db.find({}, function (err, docs) {
        res.send(docs);
    });
}));

router.post('/player', asyncMiddleware(async (req, res) => {
    const uuid = 'uuid_2';
    const name = req.body.name;
    const score = req.body.score;

    const player = new Player(uuid, name, score, '', '');

    db.insert(player, function (err, doc) {
        res.status(200).send(doc);
    });

}));

router.put('/player', asyncMiddleware(async (req, res) => {
    const uuid = req.body.uuid;
    const name = req.body.name;
    const score = req.body.score;
    const teamName = req.body.teamName;

    db.update({ uuid: uuid }, { $set: { name: name, score: score, teamName, teamName } }, function (err, numReplaced) {
        db.find({uuid: uuid}, function (err, doc) {
            res.send(doc);
        });
    });

}));

router.delete('/player', asyncMiddleware(async (req, res) => {
    const uuid = req.body.uuid;

    db.remove({ uuid: uuid }, {}, function (err, numRemoved) {
        res.status(200).send({'numberOfRemoved': numRemoved});
    });
}));

function initDB(){
    const p1 = new Player('uuid_1', 'John Doe', 11200, 'BLUE', new Date('2020-08-20T00:00:00.000Z'));
    const players = [p1];
    db.insert(players)
    return players;
}

function clearDB(){
    db = new Datastore();
}

module.exports = router;
module.exports.initDB = initDB;
module.exports.clearDB = clearDB;