const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');
const mongo = require('mongodb').MongoClient
const db = require('./db/dev.js');

let data = null;

// Connect to database 
mongo.connect(db.getUrl(), async function(err, client) {
    if (err) throw err;
    data = client.db();
    console.log(`Connected to database: ${db.getDBName()}.`);  
  });   

router.post('/player', asyncMiddleware(async (req, res) => {
    const uuid = 'foobar'
    const player = new Player(uuid, 'John Doe');

    data.collection('player').insertOne(player, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        return res.status(200).send(result);
    });

})); 

router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const uuid = 'foobar'

    data.collection('player').findOne({uuid: uuid}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        return res.status(200).send(result);
    });  
}));

module.exports = router;