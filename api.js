const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');

let db = require('./db/persistence.js');
let data = null;

(async () => {
    const env = process.argv[2];
    
    if(env === 'dev') {
        data = setDB(env);
    } 
})();

router.get('/player/:id', asyncMiddleware(async (req, res) => {

    const uuid = req.params.id;
    console.log('uuid ' + uuid);

    data.collection('player').findOne({uuid: uuid}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        console.log('apiresult: ' + result);
        return res.status(200).send(result);
        
    });  
}));

router.post('/player/', asyncMiddleware(async (req, res) => {
    // const uuid = req.params.id;

    data.collection('player').insertOne({uuid: 'foobar'}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        return res.status(200).send(result);

    });  
}));

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;