const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');

let db = require('./db/persistence.js');
const Player = require('./data/player');
const Member = require('./data/memberPlayer')
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


    router.get('/DBTeht1', asyncMiddleware(async (req, res) => {

        data.collection("player").find({}).sort({score:-1}).toArray(function(err, result){
            if (err) throw err
    
        return res.status(200).send(result)})
    }));

    router.put('/updatingmongoDBteht', asyncMiddleware(async (req, res) => {
        const pl = req.body


        data.collection('player').updateMany(
        {uuid:pl.uuid},{$set:{teamName: pl.toTeamNameTeamName}},function(err, result){
            if(err) throw err
            data.collection('player').find({teamName:pl.fromTeamName}).toArray(function(err,result){ 
                if (err) throw err
               
                    return res.status(200).send(result)
                })});
    

    }))

    router.get('/mahotonMongoDBTeht', asyncMiddleware(async (req, res) => {

        const teamsClass = {"teams":[]}
        const map = new Map();

        data.collection("player").find({}).toArray(function(err, result){
            if (err) throw err
        
            result.forEach((player) => {

                const team = player.teamName;
                const collection = map.get(team);
        
                if (!collection) {
                    map.set(team, [player]);
                }else{
                collection.push(player);
                }})
        
            for (const [teamName, players] of map) {
        
                let totalScore = 0
                players.forEach(player => {
                    totalScore += player.score})
        
                let result = {"name":teamName, "totalScore":totalScore }
                teamsClass.teams.push(result)}
        
                teamsClass.teams.sort((latestTeam, teamToCompare) => {
                    return teamToCompare.totalScore - latestTeam.totalScore})
            return res.status(200).send(teamsClass)})
    }));

    router.get('/mahotonmongoDBTehtävä2', asyncMiddleware(async (req, res) => {

        const teamsClass = {"teams":[]}
    
        const map = new Map();


        data.collection("player").find({}).toArray(function(err, result){
            if (err) throw err
        
            result.forEach((player) => {
    
            const team = player.teamName;
            const collection = map.get(team);
    
            if (!collection) {
                map.set(team, [player]);
            }else{
            collection.push(player);
            }})
    
        for (const [teamName, players] of map) {
            let members = []
            let totalScore = 0
            players.forEach(player => {
                totalScore += player.score
                const member = new Member(player.uuid, player.name, player.createdAt)
                members.push(member)
    
            })
            let result = {"name":teamName, "totalScore":totalScore, "members": members}
            teamsClass.teams.push(result)}
    
            teamsClass.teams.sort((latestTeam, teamToCompare) => {
                return teamToCompare.totalScore - latestTeam.totalScore})
        return res.status(200).send(teamsClass)})
    }));
    

    




// Endpoints here

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;