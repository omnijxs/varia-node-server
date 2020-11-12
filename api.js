const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');

let db = require('./db/persistence.js');
const Player = require('./data/player');
const { request } = require('chai');
const { playerFound } = require('./test/testHelper');
const { route } = require('./app');
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

/*******************/
/* For crudTest.js */
/*******************/

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

/********************/
/* For queryTest.js */
/********************/

router.get('/players', asyncMiddleware(async(req,res) => {
    const required = req.query
    if(required.teamName && !required.scoreHigherThan && !required.startedBefore)
    {
        data.collection('player').find({teamName: required.teamName}).toArray(function(err, result) {
        if (err) throw err
        if(result){
            return res.status(200).send(result)
        } 
    })}else if(required.teamName && required.scoreHigherThan && !required.startedBefore)
    {
        const value = parseInt(required.scoreHigherThan)
        data.collection('player').find({teamName:required.teamName,score:{$gte:value}}).toArray(function(err, result){
        if (err) throw err
        if(result){
            return res.status(200).send(result)
        } 
    })}else if(required.startedBefore && !required.scoreHigherThan && !required.teamName){
        let dateString = required.startedBefore;
        dateString = dateString.substr(6, 4)+"-"+dateString.substr(3, 2)+"-"+dateString.substr(0, 2);
        const date = new Date(dateString)
        data.collection('player').find({createdAt:{$lt:date}}).toArray(function(err, result){
            if (err) throw err
            if(result){
                return res.status(200).send(result)
            }
        })
    }else if(required.teamName && required.startedBefore && required.scoreHigherThan){
        let dateString = required.startedBefore;
        dateString = dateString.substr(6, 4)+"-"+dateString.substr(3, 2)+"-"+dateString.substr(0, 2);
        const date = new Date(dateString)
        const value = parseInt(required.scoreHigherThan)
        data.collection('player').find({teamName:required.teamName, createdAt:{$lt:date}, score:{$gte:value}}).toArray(function(err, result){
           if(err) throw err
           if(result){
               return res.status(200).send(result)
           }
        })
    }else{
        return res.status(404).send('')
    }
}))

/*******************/
/* For yourTest.js */
/*******************/

router.get('/sort', asyncMiddleware(async (req, res) => {
    var mysort = { score: -1 };
    data.collection("player").find().sort(mysort).toArray(function(err, result) {
        if (err) throw err;
        return res.status(200).send(result)
    });
}));

router.put('/change', asyncMiddleware(async (req, res) => {
    const required = req.body
    data.collection('player').find({teamName:required.fromTeamName}).toArray(function(err, result){
        if (err) throw err
        if(result){
            result.teamName = required.toTeamName
            return res.status(200).send(result)
        }else{
            return res.status(404).send([])
        }
    });
}));

router.get('/teamSort', asyncMiddleware(async (req,res) => {
    const teamList = {"teams":[]}
    const map = new Map();
    data.collection('player').find({}).toArray(function(err, result){
        const teamNames = []
        result.forEach((player) => {
            if (!teamNames.includes(player.teamName)){
                teamNames.push(player.teamName)
            }
        })
        teamNames.forEach((teamName) => {
            const teamPlayers = result.filter(player => player.teamName === teamName) 
            if(teamPlayers)
            {
                map.set(teamName, teamPlayers)
            }  
        })
        for (const [teamName, players] of map) {
            let score = 0
            players.forEach((player) => {
                console.log(player)
                score += player.score
            })
            
            let result = {"name":teamName, "totalScore":score }
            teamList.teams.push(result)
        }
        teamList.teams.sort((latestTeam, teamToCompare) => {
            return teamToCompare.totalScore - latestTeam.totalScore
        })
        return res.status(200).send(teamList)  
    });  
}))

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;