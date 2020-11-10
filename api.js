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
    const errormessage = {'message':'error'}
    

    const player = db.find(function (player) { 
        return player.uuid === playerData.uuid; 
    });
    
    if (player) {
        player.name = playerData.name;
        player.score = playerData.score;
        player.teamName = playerData.teamName;
        return res.status(200).send(player);
    } else {
        return res.status(404).send(errormessage);
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

// Query player by team name and score higher than function
router.get('/players', asyncMiddleware(async (req, res) => {
    const queryParams = req.query;
    let players = [];
    

    if (queryParams.teamName && !queryParams.scoreHigherThan) {
        players = db.filter(function (player) { 
            return player.teamName === queryParams.teamName; 
        } );
    }else 
    if (queryParams.teamName && queryParams.scoreHigherThan && !queryParams.startedBefore) {
        players = db.filter(function (player) { 
            return player.teamName === queryParams.teamName && player.score > queryParams.scoreHigherThan; 
        } );

    } else 
    //Query players who started playing before
    if (queryParams.startedBefore && !queryParams.scoreHigherThan) {
        players = db.filter(function (player) {
            
            const dateStrings = queryParams.startedBefore.split('-');
        
            const dateToCompare = new Date();
            
            dateToCompare.setDate(parseInt(dateStrings[0]));
            dateToCompare.setMonth(parseInt(dateStrings[1])-1);
            dateToCompare.setYear(parseInt(dateStrings[2]));
            
            const found = player.createdAt.getTime() < dateToCompare.getTime();

            if (found) {
                //console.log(player.uuid);
            }

            return player.createdAt.getTime() < dateToCompare.getTime(); 
        } );

    } else 
    if (queryParams.teamName && queryParams.startedBefore && 
        queryParams.scoreHigherThan) {
        players = db.filter(function (player) {
            //console.log('foobar');
            
            const dateStrings = queryParams.startedBefore.split('-');
        
            const dateToCompare = new Date();
            
            dateToCompare.setDate(parseInt(dateStrings[0]));
            dateToCompare.setMonth(parseInt(dateStrings[1])-1);
            dateToCompare.setYear(parseInt(dateStrings[2]));
            
            const found = player.createdAt.getTime() < dateToCompare.getTime();

            if (found) {
                //console.log(player.uuid);
            }

            return player.teamName === queryParams.teamName && 
            player.createdAt.getTime() < dateToCompare.getTime() && 
            player.score > queryParams.scoreHigherThan;  
        } );
    } else {

    }

    return res.status(200).send(players);
  
}));
//------------------------------------------------------------------------
// It returns all players sorted by score in descending order.
router.get('/sort', asyncMiddleware(async (req, res) => {
    

    // Sort scores in descending order:
    const result = db.sort(function(a, b){return b.score-a.score});
    
    
    return res.status(200).send(result);
    
}));

// It updates all players with a given team name to another team name.
router.put('/update', asyncMiddleware(async (req, res) => {
    const players = [];
    const requestParams = req.body;
    db.forEach(function (player) {
        
        if (player.teamName === requestParams.fromTeam) {
            player.teamName = requestParams.toTeam;
            players.push(player);
        }
        
    });
    
    //console.log(db);
    return res.status(200).send(players);
    
}));

router.get('/return', asyncMiddleware(async (req, res) => {
    const result = {"teams":[]}
    
    
    function groupByTeams(data) {
        // Find the teams
        const teams = data.map(({ team }) => team);
        const uniqueTeams = [...new Set(teams)];
        console.log(uniqueTeams);
      
        // Map the array of unique values to return
        // desired result.
        return uniqueTeams.map(team => {
          return {
            team,
            team_total_score: data.find((thisTeam) => thisTeam.team === team).team_total_score,
            Players: data
              .filter(thisTeam => thisTeam.team === team)
              .map(({ player, player_id }) => ({ player_id, player }))
          }
        });
      }
      
      groupByTeams(inputData);

    return res.status(200).send(result);
    
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