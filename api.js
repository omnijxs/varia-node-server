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
    const id = req.params.id;
    const result = db.find(player => player.uuid === id);
    if (result){
        return res.status(200).send(result);
    }else{
        return res.status(404).send(result);
    }
}));

router.post('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;
    const newid = 'ID'
    const date = new Date()
    const player = new Player (newid, payload.name, payload.score, payload.teamName, date)
    
    db.push(player);
    return res.status(200).send(player);
}));

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

router.delete('/player', asyncMiddleware(async (req, res) => {
    const payload = req.body;

    const player = db.find(function (player) {
        return player.uuid === payload.uuid;
    });
    db.splice(player, 1);
    return res.status(200).send(player);
}));
/*################################# */

router.get('/players', asyncMiddleware(async (req, res) => {
    const queryParams = req.query;
    let result
    if (queryParams.teamName && !queryParams.scoreHigherThan){
        result = db.filter(player => player.teamName === queryParams.teamName);
    }else if(queryParams.teamName && queryParams.scoreHigherThan && !queryParams.startedBefore){
        result = db.filter(player => {
            return player.teamName === queryParams.teamName && player.score > queryParams.scoreHigherThan
        });
    }else if (queryParams.startedBefore && !queryParams.teamName){

        const date1 = queryParams.startedBefore
        const date2 = new Date(date1.split('-').reverse().join('-'));
        result = db.filter(player => {
            return player.createdAt < date2
        });
    }else if (queryParams.teamName && queryParams.startedBefore && queryParams.scoreHigherThan){
        const date1 = queryParams.startedBefore
        const date2 = new Date(date1.split('-').reverse().join('-'));
        result = db.filter(player => {
            console.log(date2);
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