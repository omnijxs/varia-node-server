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

module.exports = router;
module.exports.mockDB = mockDB;
module.exports.clearDB = clearDB;
module.exports.getDB = getDB;