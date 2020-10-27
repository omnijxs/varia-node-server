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

// Get player by id function
router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id;


    const result = db.find(function (player) { 
        return player.uuid === id; 
    }); 
    if (result) {
        return res.status(200).send(result);
    } else {
        return res.status(404).send(result);
    }
         
    
}));

// Create player function
router.post('/player', asyncMiddleware(async (req, res) => {
    const playerData = req.body;
    const bal = 'uuid';
    const bal2 = 'createdAt'
    const player = new Player(bal, playerData.name, playerData.score, playerData.teamName, bal2);


    db.push(player)  
    return res.status(200).send(player);
    
    
}));

// Update player function
router.put('/player', asyncMiddleware(async (req, res) => {
    const playerData = req.body;
    

    const player = db.find(function (player) { 
        return player.uuid === playerData.uuid; 
    });
    
    if (player) {
        player.name = playerData.name;
        player.score = playerData.score;
        player.teamName = playerData.teamName;
        return res.status(200).send(player);
    } else {
        return res.status(404).send({});
    }

    
}));

// Delete player function
router.delete('/player', asyncMiddleware(async (req, res) => {
    const playerData = req.body;


    const player = db.find(function (player) { 
        return player.uuid === playerData.uuid; 
    });

 
    db.splice(player, 1);
    return res.status(200).send(player);
    
    
    
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