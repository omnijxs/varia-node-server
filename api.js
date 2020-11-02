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

// Endpoints here

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;