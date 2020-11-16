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

router.get('/foo', asyncMiddleware(async (req, res) => {
    const result = {"foo":"bar"}
    return res.status(200).send(result);
}));

router.get("/player/:id", asyncMiddleware(async (req, res) => {
    const id = req.params.id
    data.collection('player').findOne({uuid: id}, function(err, result) {
        if (result){
            return res.status(200).send(result);
        }else{
            return res.status(404).send(result); 
        }
    });
    
}));

router.post('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const newid = 'ID'
    const date = new Date()
    const obj = new Player (newid, payload.name, payload.score, payload.teamName, date)
    data.collection('player').insertOne(obj, function(err, result) {
        if (result){
            return res.status(200).send(obj);
        }else{
            return res.status(404).send(obj); 
        }
    });
}));

router.put('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const id = payload.uuid
    data.collection('player').updateOne({uuid: id},
        {$set:{'name': payload.name,
                'score': payload.score,
                'teamName': payload.teamName}}, function(err, result){  
        data.collection('player').findOne({uuid: id}, function(err, result){
            if (result){
                return res.status(200).send(result);
            }else{
                return res.status(404).send(result); 
            }
        });
    });
}));

router.delete("/player", asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const id = payload.uuid;
    data.collection('player').findOne({uuid: id}, function(err, result) {
        data.collection('player').deleteOne({uuid: id})
        console.log(result)
        if (result){
            return res.status(200).send(result);
        }else{
            return res.status(404).send(result); 
        }
    });
    
}));
// Endpoints here

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;