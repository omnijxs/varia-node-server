const mongo = require('mongodb').MongoClient

let dbName = ''
let url = `mongodb://127.0.0.1:27017/${dbName}`
let data = null;

const connectConfig = { useNewUrlParser: true, useUnifiedTopology: true }

const Player = require('../data/player.js');

const loadDB = async (env) => {

  if (data) {
      return data;
  }

  try {
      if(env === 'test'){
        dbName = 'apiTest'
        const client = await mongo.connect(url, connectConfig);
        data = client.db('apiTest');
      }

      if(env === 'dev') {
        dbName = 'apiDev'
        const client = await mongo.connect(url, connectConfig);
        data = client.db('apiDev');
      }
 
  } catch (err) {
      throw err;
  }

  return data;

};

const populateDB = async () => {

  let players = [];

  try {
      const client = await mongo.connect(url, connectConfig);
      data = client.db(dbName);

      data.collection('player').insertMany(getPlayerData(), function(err, res) {
        if (err) {
            return res.status(500).send(err);
        };

        return players;
        
      });

  } catch (err) {
      throw err;
  }
  
};

const emptyDB = async () => {

  let players = [];

  try {
      const client = await mongo.connect(url, connectConfig);
      data = client.db(dbName);

      data.collection('player').deleteMany({}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        players;
        
      });

  } catch (err) {
      throw err;
  }
  
};


/**
 * Dummy data for mongo collection player
 */
function getPlayerData() {
  const p1 = new Player('uuid_1', 'John Doe', 14240, 'BLUE', new Date('2020-08-20T00:00:00.000Z'));
  const p2 = new Player('uuid_2', 'Jane Doe', 11200, 'BLUE', new Date('2019-11-27T00:00:00.000Z'));
  const p3 = new Player('uuid_3', 'John Coe', 13200, 'RED', new Date('2019-04-01T00:00:00.000Z'));
  const p4 = new Player('uuid_4', 'George Doe', 12660, 'BLUE', new Date('2020-01-19T00:00:00.000Z'));
  const p5 = new Player('uuid_5', 'Jane Coe', 11700, 'RED', new Date('2020-02-15T00:00:00.000Z'));
  const p6 = new Player('uuid_6', 'George Coe', 15440, 'GREEN', new Date('2019-09-20T00:00:00.000Z'));
  const p7 = new Player('uuid_7', 'George Daffodil', 15440, 'PURPLE', new Date('2020-06-01T00:00:00.000Z'));
  const p8 = new Player('uuid_8', 'Mark Coe', 7800, 'PURPLE', new Date('2020-01-01T00:00:00.000Z'));
  const p9 = new Player('uuid_9', 'June Worth', 11420, 'PURPLE', new Date('2019-01-01T00:00:00.000Z'));
  players = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
  return players;
}

module.exports.loadDB = loadDB;
module.exports.populateDB = populateDB;
module.exports.emptyDB = emptyDB;
module.exports.getPlayerData = getPlayerData;