const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');

let db = require('./db/persistence.js');
const Player = require('./data/player');
let data = null;

(async () => {
    const env = process.argv[2];
    
    if(env === 'dev') {
        data = setDB(env);
    } 
})();

router.get('/player/:id', asyncMiddleware(async (req, res) => {

    const uuid = req.params.id;

    data.collection('player').findOne({uuid: uuid}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        if(result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send();
        }
        
    });  
}));

router.post('/player/', asyncMiddleware(async (req, res) => {

    const payload = req.body;

    const player = new Player();
    player.uuid = 'whatevs'
    player.createdAt = new Date();
    player.name = payload.name;
    player.teamName = payload.teamName;
    player.score = payload.score;

    data.collection('player').insertOne(player, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        if(result) {
            return res.status(200).send(player);
        } else {
            return res.status(404).send();
        }
        
    });  
}));

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;