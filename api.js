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

// Get player by id function
router.get('/player/:id', asyncMiddleware(async (req, res) => {
    const id = req.params.id;

    data.collection('player').findOne({uuid: id}, function(err, result) {
        if (err) throw err;
        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send(result);
        }
    });
}));

// Create player function
router.post('/player', asyncMiddleware(async (req, res) => {
    const playerData = req.body;
    const bal = 'uuid';
    const bal2 = 'createdAt'
    const player = new Player(bal, playerData.name, playerData.score, playerData.teamName, bal2);

    data.collection('player').insertOne({player}, function(err, result) {
        if (err) throw err;
        return res.status(200).send(player);
        
    });

}));

// Update player function
router.put('/player', asyncMiddleware(async (req, res) => {
    const playerData = req.body;

    data.collection('player').updateOne({uuid: playerData.uuid},
         {$set: {'name': playerData.name, 
                 'score': playerData.score, 
                 'teamName': playerData.teamName}}, function(err, result) {
        if (err) throw err;
        data.collection('player').findOne({uuid: playerData.uuid}, function(err, result) {
            if (err) throw err;
            if (result) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send(result);
            }
        });
    });

}));

// Delete player function
router.delete('/player', asyncMiddleware(async (req, res) => {
    const playerData = req.body;

       data.collection('player').deleteOne({uuid: playerData.uuid}, function(err, result) {
           if (err) throw err;
           if (result) {
               return res.status(200).send(result);
           } else {
               return res.status(404).send(result);
           }
       });  

}));

// Query player by team name and score higher than function ________________________________________
router.get('/players', asyncMiddleware(async (req, res) => {
    const queryParams = req.query;

 
    if (queryParams.teamName && !queryParams.scoreHigherThan) {
        data.collection('player').find({teamName: queryParams.teamName}).toArray (function (err, result) {
            if (err) throw err;
            return res.status(200).send(result)  
        } );

    }else 
    if (queryParams.teamName && queryParams.scoreHigherThan && !queryParams.startedBefore ) {

        const parsed = parseInt(queryParams.scoreHigherThan)
        data.collection('player').find({teamName: queryParams.teamName, 
            score: {$gt: parsed}}).toArray (function (err, result) {
            if (err) throw err;
            return res.status(200).send(result)  
        } );

    }else 
    //Query players who started playing before
    if (queryParams.startedBefore && !queryParams.scoreHigherThan) {

        const dateStrings = queryParams.startedBefore.split('-');
        const dateToCompare = new Date();

        dateToCompare.setDate(parseInt(dateStrings[0]));
        dateToCompare.setMonth(parseInt(dateStrings[1])-1);
        dateToCompare.setYear(parseInt(dateStrings[2]));

        data.collection('player').find({createdAt: {$lt: dateToCompare}}).toArray (function (err, result) {
 
            if (err) throw err;
            return res.status(200).send(result)
        } );
    }else
    // Query players by team name, started before and score greater than
    if (queryParams.teamName && queryParams.startedBefore && queryParams.scoreHigherThan) {

            const dateStrings = queryParams.startedBefore.split('-');
            const dateToCompare = new Date();

            dateToCompare.setDate(parseInt(dateStrings[0]));
            dateToCompare.setMonth(parseInt(dateStrings[1])-1);
            dateToCompare.setYear(parseInt(dateStrings[2]));
            

            const parsed = parseInt(queryParams.scoreHigherThan)

            data.collection('player').find({teamName: queryParams.teamName,
                createdAt: {$lt: dateToCompare}, score: {$gt: parsed}})
                .toArray (function (err, result) {
 
                if (err) throw err;
                return res.status(200).send(result)
            } );
    } else {

    } 
    
}));
//------------------------------------------------------------------------
// It returns all players sorted by score in descending order.
router.get('/sort', asyncMiddleware(async (req, res) => {

    // Sort scores in descending order:
    data.collection('player').find({ }).sort({ score : -1})
        .toArray (function (err, result) {

        if (err) throw err;
        return res.status(200).send(result)
    } );

}));
// It updates all players with a given team name to another team name.
router.put('/update', asyncMiddleware(async (req, res) => {
    //const players = [];
    const requestParams = req.body;
    
    data.collection('player').updateMany({teamName: requestParams.fromTeam}, 
        {$set: {'teamName': requestParams.toTeam}}, function(err, result) {
       if (err) throw err;
       data.collection('player').find({teamName: requestParams.toTeam}).toArray (function(err, result) {
           //console.log(result);

           if (err) throw err;
           return res.status(200).send(result)
        
       });
   });

}));

// router.get('/return', asyncMiddleware(async (req, res) => {
//     const result = {"teams":[]}


//     function groupByTeams(data) {
//         // Find the teams
//         const teams = data.map(({ team }) => team);
//         const uniqueTeams = [...new Set(teams)];
//         console.log(uniqueTeams);

//         // Map the array of unique values to return
//         // desired result.
//         return uniqueTeams.map(team => {
//           return {
//             team,
//             team_total_score: data.find((thisTeam) => thisTeam.team === team).team_total_score,
//             Players: data
//               .filter(thisTeam => thisTeam.team === team)
//               .map(({ player, player_id }) => ({ player_id, player }))
//           }
//         });
//       }

//       groupByTeams(inputData);

//     return res.status(200).send(result);

// }));

// Endpoints here

async function setDB(env) {
    data = await db.loadDB(env);
}

module.exports = router;
module.exports.setDB = setDB;