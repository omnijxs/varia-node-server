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

router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id
    data.collection('player').findOne({uuid:id}, function(err, result){
    if (err) throw err;
    if(result){
        return res.status(200).send(result);
    }else{
        return res.status(404).send('');
    }})
}));

router.post('/player', asyncMiddleware(async (req, res) => {

    const givenData =  req.body
    const newId = "uuid_" + db.length + 1
    date = new Date
    const player = new Player(newId, givenData.name, givenData.score, givenData.teamName, date)
    data.collection('player').insertOne({player}, function(err, result){
    if (err) throw err;
    return res.status(200).send(player)})
}));


router.put('/player', asyncMiddleware(async (req, res) => {
    const pl = req.body
    data.collection('player').updateOne(
    {uuid:pl.uuid},{$set:{uuid: pl.uuid,name: pl.name,score: pl.score,teamName: pl.teamName}},function(err, result){
        if(err) throw err
        data.collection('player').findOne({uuid:pl.uuid}, function(err,result){ 
            if (err) throw err
            if(result){
                return res.status(200).send(result)
            }else{
                return res.status(404).send('')
            }})})}));


router.delete('/player', asyncMiddleware(async (req, res) => {

    const pl = req.body
    data.collection('player').deleteOne({uuid:pl.uuid}, function(err,result){ 
    if (result){
        return res.status(200).send({})
    }else{
        return res.status(404).send(errormessage)
    }})
}));





router.get('/players', asyncMiddleware(async (req, res) => {

    const pl = req.query

    if (pl.teamName && !pl.scoreHigherThan && !pl.startedBefore){ 

        data.collection("player").find({teamName:pl.teamName}).toArray(function(err, result) {
            if (err) throw err;
        return res.status(200).send(result)})

    } else if (pl.teamName && pl.scoreHigherThan && !pl.startedBefore) {

        const value = parseInt(pl.scoreHigherThan)
        data.collection("player").find({score:{$gt: value},teamName:pl.teamName}).toArray(function(err, result){ 
        if (err) throw err;
        return res.status(200).send(result)})

    }else if (!pl.teamName && !pl.scoreHigherThan && pl.startedBefore){

        let sB = pl.startedBefore
        sB = sB.substr(6,4)+"-"+sB.substr(3,2)+"-"+sB.substr(0,2)
        let date = new Date(sB)
        
        data.collection("player").find({createdAt:{$lt: date}}).toArray(function(err, result){ 
            if (err) throw err;
        if(result){ 
            return res.status(200).send(result)   
        }else{
            return res.status(404).send({})
        }})
    
    }else if (pl.teamName && pl.scoreHigherThan && pl.startedBefore){

        let sB = pl.startedBefore
        sB = sB.substr(6,4)+"-"+sB.substr(3,2)+"-"+sB.substr(0,2)
        let date = new Date(sB)

        const value = parseInt(pl.scoreHigherThan)

        data.collection("player").find({teamName:pl.teamName,score:{$gt:value},createdAt:{$lt: date}}).toArray(function(err, result){
            if (err) throw err;
            return res.status(200).send(result)})
    } else { 
        return res.status(404).send([])
    }}))



//player => player.teamName === pl.teamName && player.score > pl.scoreHigherThan






// Endpoints here

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;