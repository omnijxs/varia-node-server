const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');

let db = [];

/**
 * An example how an endpoint is implemented
 */
router.get('/foo', asyncMiddleware(async (req, res) => {
    const result = {"foo":"bar"}
    return res.status(200).send(result);
}));

/* Get player by id */
router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id;
    const result = db.find(player => player.uuid === id);
    if (result){
        return res.status(200).send(result);
    }else{
        return res.status(404).send(result);
    }
}));

/* Create player */
router.post('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const newid = 'ID'
    const date = new Date()
    const player = new Player (newid, payload.name, payload.score, payload.teamName, date)
    
    db.push(player);
    return res.status(200).send(player);
}));

/* Update player */
router.put('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const id = payload.uuid;
    const errormessage = {"message":"error"};
    const player = db.find(player => player.uuid === id);
    if (player){
        player.uuid = payload.uuid;
        player.name = payload.name;
        player.score = payload.score;
        player.teamName = payload.teamName;
        return res.status(200).send(player);
    }else{
        return res.status(404).send(errormessage);
    }
}));

/* Delete player */
router.delete('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;

    const player = db.find(function (player) {
        return player.uuid === payload.uuid;
    });
    db.splice(player, 1);
    return res.status(200).send(player);
}));

/***** QueryTest.js *****/

router.get('/players', asyncMiddleware(async (req, res) => {
    const queryParams = req.query;
    let result
    /* Query player by team name */
    if (queryParams.teamName && !queryParams.scoreHigherThan){
        result = db.filter(player => player.teamName === queryParams.teamName);
    /* Query player by team name and score higher than */
    }else if(queryParams.teamName && queryParams.scoreHigherThan && !queryParams.startedBefore){
        result = db.filter(player => {
            return player.teamName === queryParams.teamName && player.score > queryParams.scoreHigherThan
        });
    /* Query players who started playing before */
    }else if (queryParams.startedBefore && !queryParams.teamName){

        const date1 = queryParams.startedBefore
        const date2 = new Date(date1.split('-').reverse().join('-'));
        result = db.filter(player => {
            return player.createdAt < date2
        });
    /* Query players by team name, started before and score greater than */
    }else if (queryParams.teamName && queryParams.startedBefore && queryParams.scoreHigherThan){
        const date1 = queryParams.startedBefore
        const date2 = new Date(date1.split('-').reverse().join('-'));
        result = db.filter(player => {
            return player.teamName === queryParams.teamName && player.createdAt < date2 && player.score > queryParams.scoreHigherThan
        });
    }else{

    }
    
    if (result){
        return res.status(200).send(result);
    }else{
        return res.status(404).send(result);
    }
}));
/***** YourTest.js *****/
router.get('/sort', asyncMiddleware(async (req, res) => {
    result = db.sort((p1, p2) => {
        return p2.score - p1.score
    });

    if (result){
        return res.status(200).send(result);
    }else{
        return res.status(404).send(result);
    }
}));

router.put('/update', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const players = db.filter(function (player) {
        return player.teamName === payload.fromTeamName;
    });

    if (players){
        players.forEach(player => {
            player.teamName = payload.toTeamName
        });
        return res.status(200).send(players);
    }else{
        return res.status(404).send();
    }
}));

/*router.get('/group', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const blue = db.filter(function (player) {
        return player.teamName === "BLUE";
    });
    console.log(blue);
    const Teams = 
        {
            "teams" : [
        {
         "name": "BLUE",
         "totalScore": "helo"
    
        },
        {
            "name": "RED",
            "totalScore": "helo"
       
        },
        {
            "name": "GREEN",
            "totalScore": "helo"
       
        },
        {
            "name": "PURPLE",
            "totalScore": "helo"
       
        }
        ]
    }
    console.log(Teams);
    if (Teams){
        return res.status(200).send(Teams);
    }else{
        console.log(Teams)
        return res.status(404).send();
    }
}));
*/

router.get('/group', asyncMiddleware(async (req,res) => {
    const Teams = {"teams":[]}
    const map = new Map();
    db.forEach((player) => {
        const team = player.teamName;
        const collection = map.get(team);

        if (!collection) {
            map.set(team, [player]);
        }else{
        collection.push(player);
        }});

    for (const [teamName, players] of map) {
 
        let totalScore = 0
        players.forEach(player => {
            totalScore += player.score})
 
        let result = {"name":teamName, "totalScore":totalScore }
        Teams.teams.push(result)}
 
        Teams.teams.sort((latestTeam, teamToCompare) => {
            return teamToCompare.totalScore - latestTeam.totalScore})
 

    if (Teams){
        return res.status(200).send(Teams);
    }else{
        return res.status(404).send();
    }
}));

router.get('/update', asyncMiddleware(async (req, res) => {
    const Teams = {"teams":[]}
    const map = new Map();
    db.forEach((player) => {
        const team = player.teamName;
        const collection = map.get(team);

        if (!collection) {
            map.set(team, [player]);
        }else{
        collection.push(player);
        }});

    for (const [teamName, players] of map) {

        let members = []
        let totalScore = 0
        players.forEach(player => {
            const date = player.createdAt
            totalScore += player.score
            const member = {"uuid":player.uuid, "name":player.name, "createdAtYear":date.getFullYear()}
            members.push(member)
        });
        let result = {"name":teamName, "totalScore":totalScore, "members": members}
        Teams.teams.push(result)}
        Teams.teams.sort((latestTeam, teamToCompare) => {
            return teamToCompare.totalScore - latestTeam.totalScore})
    return res.status(200).send(Teams)
}));
 
 

/**
 * Mock DB helper functions
 */

function mockDB(){
    const p1 = new Player('uuid_1', 'John Doe', 14240, 'BLUE', new Date('2020-08-20T00:00:00.000Z'));
    const p2 = new Player('uuid_2', 'Jane Doe', 11200, 'BLUE', new Date('2019-11-27T00:00:00.000Z'));
    const p3 = new Player('uuid_3', 'John Coe', 13200, 'RED', new Date('2019-04-01T00:00:00.000Z'));
    const p4 = new Player('uuid_4', 'George Doe', 12660, 'BLUE', new Date('2020-01-19T00:00:00.000Z'));
    const p5 = new Player('uuid_5', 'Jane Coe', 11700, 'RED', new Date('2020-02-15T00:00:00.000Z'));
    const p6 = new Player('uuid_6', 'George Coe', 15440, 'GREEN', new Date('2019-09-20T00:00:00.000Z'));
    const p7 = new Player('uuid_7', 'George Daffodil', 15440, 'PURPLE', new Date('2020-06-01T00:00:00.000Z'));
    const p8 = new Player('uuid_8', 'Mark Coe', 7800, 'PURPLE', new Date('2020-01-01T00:00:00.000Z'));
    const p9 = new Player('uuid_9', 'June Worth', 11420, 'PURPLE', new Date('2019-01-01T00:00:00.000Z'));
    db = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
    return db;
}

function clearDB(){
    db = [];
}

function getDB(){
    return db;
}

if(process.argv[2] === 'dev') {
  console.log('Running in dev')
  db = mockDB();
}

module.exports = router;
module.exports.mockDB = mockDB;
module.exports.clearDB = clearDB;
module.exports.getDB = getDB;