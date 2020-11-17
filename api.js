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
router.get('/players', asyncMiddleware(async (req, res) => {
    const queryParams = req.query;
    const collection = data.collection('player')
    /* Query player by team name */
    if (queryParams.teamName && !queryParams.scoreHigherThan){

        collection.find({teamName: queryParams.teamName}).toArray(function(err, result) {
        if (err) throw err;
        return res.status(200).send(result);
    });
    /* Query player by team name and score higher than */
    }else if(queryParams.teamName && queryParams.scoreHigherThan && !queryParams.startedBefore){

        const scoreHigherThan = parseInt(queryParams.scoreHigherThan)
        collection.find({teamName: queryParams.teamName, score: { $gt: scoreHigherThan }}).toArray(function(err, result) {
            return res.status(200).send(result);
            
        });
    /* Query players who started playing before */
    }else if (queryParams.startedBefore && !queryParams.teamName){

        const date1 = queryParams.startedBefore
        const date2 = new Date(date1.split('-').reverse().join('-'));

        collection.find({createdAt: { $lt: date2 }}).toArray(function(err, result) {
            return res.status(200).send(result);
        });

    /* Query players by team name, started before and score greater than */
    }else if (queryParams.teamName && queryParams.startedBefore && queryParams.scoreHigherThan){
        const date1 = queryParams.startedBefore
        const date2 = new Date(date1.split('-').reverse().join('-'));
        const scoreHigherThan = parseInt(queryParams.scoreHigherThan)

        collection.find({teamName: queryParams.teamName, createdAt: { $lt: date2 }, score: { $gt: scoreHigherThan }}).toArray(function(err, result) {
            console.log(result)
            return res.status(200).send(result);
        });
    }else{
    
    }
}));

/*##### yourTest ###### */
router.get('/sort', asyncMiddleware(async (req, res) => {
    var mysort = { score: -1 };
    data.collection('player').find().sort(mysort).toArray(function(err, result) {
        return res.status(200).send(result);
    });
    
}));

router.put('/update', asyncMiddleware(async (req, res) => {

    const payload = req.body;
    const team = payload.teamName
    data.collection('player').updateMany({teamName: payload.fromTeamName},
        {$set:{'teamName': payload.toTeamName}}, function(err, result){  
        data.collection('player').find({teamName: payload.toTeamName}).toArray(function(err, result) {
            console.log(result)
            console.log()
            if (result){
                return res.status(200).send(result);
            }else{
                return res.status(404).send(result); 
            }
        });
    });
}));
// Endpoints here

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;