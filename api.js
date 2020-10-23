const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');
const mongo = require('mongodb').MongoClient

let db = require('./db/dev.js');
let data = null;

(async () => {
    data = await db.loadDB();
})();

router.get('/foo', asyncMiddleware(async (req, res) => {
    const result = {"foo":" bar"}
    return res.status(200).send(result);
}));

router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const uuid = req.params.id;

    console.log("UUID: " + uuid);

    data.collection('player').findOne({uuid: uuid}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        return res.status(200).send({result});
    });  
}));

module.exports = router;