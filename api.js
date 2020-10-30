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

router.get('/players/', asyncMiddleware(async (req, res) => {
    const queryParams = req.query

    data.collection('player').find({teamName: queryParams.teamName}).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        return res.status(200).send(result);
      });
}));

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;