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


/**
 * Helper functions
 * Extract later to another class
 */

function mockDB(){
    const p1 = new Player('uuid_1', 'John Doe', 14240, 'BLUE', new Date('2020-08-20T00:00:00.000Z'));
    const p2 = new Player('uuid_2', 'John Doe', 11200, 'BLUE', new Date('2019-11-27T00:00:00.000Z'));
    const p3 = new Player('uuid_3', 'John Doe', 13200, 'RED', new Date('2019-04-01T00:00:00.000Z'));
    const p4 = new Player('uuid_4', 'John Doe', 12660, 'BLUE', new Date('2020-01-19T00:00:00.000Z'));
    const p5 = new Player('uuid_5', 'John Doe', 11700, 'RED', new Date('2020-02-15T00:00:00.000Z'));
    const p6 = new Player('uuid_6', 'John Doe', 15440, 'GREEN', new Date('2019-09-20T00:00:00.000Z'));
    db = [p1, p2, p3, p4, p5, p6];
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