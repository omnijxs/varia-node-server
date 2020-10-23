const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');
const mongo = require('mongodb').MongoClient

let db = require('./db/dev.js');
let data = null;

(async () => {
    console.log('food')
    data = await db.loadDB();
})();

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