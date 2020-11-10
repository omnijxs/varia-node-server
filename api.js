const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');

let db = require('./db/persistence.js');
const Player = require('./data/player');
const { request } = require('chai');
const { playerFound } = require('./test/testHelper');
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

// Endpoints here

router.get('/player/:id', asyncMiddleware(async(req,res) =>{
    const id = req.params.id
    data.collection('player').findOne({uuid: id}, function(err, result) {
        if (err) throw err;
        if (result)
        {
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send('')
        }
    });
}));
router.post('/player', asyncMiddleware(async(req,res) => {
    const payload = req.body
    const newId = "uuid_10"
    const createdAt = new Date()
    const player = new Player(newId, payload.name, payload.score, payload.teamName,createdAt)
    data.collection('player').insertOne({player}, function(err, result){
        if (err) throw err;
            return res.status(200).send(player)
    });
}))
router.put('/player', asyncMiddleware(async(req,res) =>{
    const required = req.body
    data.collection('player').updateOne(
        {uuid:required.uuid}, 
        {$set:
            {
            uuid:required.uuid,
            name:required.name,
            score:required.score,
            teamName:required.teamName
            }
        },
        function(err, result){
            if (err) throw err
            data.collection('player').findOne({uuid: required.uuid}, function(err, result) {
                if (err) throw err
                if(result){
                    return res.status(200).send(result)
                }else{
                    return res.status(404).send('')
                }
            });
        }
    )
}))

router.delete('/player', asyncMiddleware(async(req,res) => {
    const required = req.body
    data.collection('player').deleteOne(
        {uuid: required.uuid}
     )
     return res.status(200).send('')
}))

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;