const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');
const Player = require('./data/player.js');
const Member = require('./data/memberPlayer.js');
let db = [];

/**
 * An example how an endpoint is implemented
 */
router.get('/foo', asyncMiddleware(async (req, res) => {
    const result = {"foo":"bar"}
    return res.status(200).send(result);
}));

router.get('/player/:id', asyncMiddleware(async (req, res) => {

    const id = req.params.id
    const answer = db.find(player => player.uuid === id)
    if(answer){
        return res.status(200).send(answer);
    }
    else{
        
        return res.status(404).send({});
    }
   
}));

router.post('/player', asyncMiddleware(async (req, res) => {

    const payload =  req.body
    const newId = "uuid_" + db.length + 1

    const createdAt = new Date()

     

    const newPlayer = new Player(newId, payload.name, payload.score, payload.teamName,createdAt)
    db.push(newPlayer)
    return res.status(200).send(newPlayer)
}));

router.put('/player', asyncMiddleware(async (req, res) => {

    const pl = req.body
    const uP = db.find(player => player.uuid === pl.uuid)
    const errormessage = {"message":"error"}
   
    if (uP){
        uP.name = pl.name
        uP.score = pl.score
        uP.teamName = pl.teamName
        return res.status(200).send(uP)
    }
    else
    { 
        return res.status(404).send(errormessage)
    }
}));

router.delete('/player', asyncMiddleware(async (req, res) => {

    const pl = req.body
    const uP = db.find(player => player.uuid === pl.uuid)
    if (uP){

        db.splice(db[pl.uuid], 1)
        return res.status(200).send({})
    }else{
        return res.status(404).send(errormessage)
    }
}));

//?name=John Doe&teamName=RED&

router.get('/players', asyncMiddleware(async (req, res) => {

    const pl = req.query

    if (pl.teamName && !pl.scoreHigherThan && !pl.startedBefore){ 

        const sP = db.filter(player => player.teamName === pl.teamName)
        return res.status(200).send(sP)

    } else if (pl.teamName && pl.scoreHigherThan && !pl.startedBefore) {

        const sP= db.filter(player => player.teamName === pl.teamName && player.score > pl.scoreHigherThan)
        return res.status(200).send(sP)

    }else if (!pl.teamName && !pl.scoreHigherThan && pl.startedBefore){

        const sP= db.filter(player => {  

            let sB = pl.startedBefore
            sB = sB.substr(6,4)+"-"+sB.substr(3,2)+"-"+sB.substr(0,2)
            let date = new Date(sB)
            date = date.getTime()

            //pD = player Date
            pD = new Date(player.createdAt)
            pD = pD.getTime()

            return pD < date
        })
    
        return res.status(200).send(sP)
    }else if (pl.teamName && pl.scoreHigherThan && pl.startedBefore){

        const sP= db.filter(player => player.teamName === pl.teamName && player.score > pl.scoreHigherThan)

        const vastaus = sP.filter(player => {  

            let sB = pl.startedBefore
            sB = sB.substr(6,4)+"-"+sB.substr(3,2)+"-"+sB.substr(0,2)
            let date = new Date(sB)
            date = date.getTime()

            //pD = player Date
            pD = new Date(player.createdAt)
            pD = pD.getTime()

            return pD < date
        })

       

        return res.status(200).send(vastaus)

    } else { 
        return res.status(404).send([])

    }

    
   

  


}));
router.get('/juhaninTeht', asyncMiddleware(async (req, res) => {
    const pl = req.query

    teht1 = db.filter(player => player.name === pl.name)


    return res.status(200).send(teht1)
}));

router.get('/teht', asyncMiddleware(async (req, res) => {

    const sortedList = db.sort((p1, p2) => {
        
        return p2.score - p1.score
        })

    return res.status(200).send(sortedList)
}));

router.get('/teht', asyncMiddleware(async (req, res) => {

    const sortedList = db.sort((p1, p2) => {
        
        return p2.score - p1.score
        })

    return res.status(200).send(sortedList)
}));
router.put('/updatingTeht', asyncMiddleware(async (req, res) => {


    const pl = req.body

    const updatedList = []
    db.map(player => {
        if (player.teamName == pl.fromTeamName){
            player.teamName = pl.toTeamName
            updatedList.push(player)
        }
    })

    return res.status(200).send(updatedList)
}));

router.get('/mahotonTeht', asyncMiddleware(async (req, res) => {

    const teamsClass = {"teams":[]}
   
    const map = new Map();
    db.forEach((player) => {

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

    return res.status(200).send(teamsClass)
}));

router.get('/mahotonTehtävä2', asyncMiddleware(async (req, res) => {

    const teamsClass = {"teams":[]}
   
    const map = new Map();
    db.forEach((player) => {

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
            members.push(member)})
        let result = {"name":teamName, "totalScore":totalScore, "members": members}
        teamsClass.teams.push(result)}

        teamsClass.teams.sort((latestTeam, teamToCompare) => {
            return teamToCompare.totalScore - latestTeam.totalScore})
            console.log(teamsClass)
    return res.status(200).send(teamsClass)
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