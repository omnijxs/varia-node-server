const mongo = require('mongodb').MongoClient
const dbName = 'apiDev'
const url = `mongodb://127.0.0.1:27017/${dbName}`

let data  = null;
const connectConfig = { useNewUrlParser: true, useUnifiedTopology: true }

const Player = require('../data/player.js');

// TODO make one db config file. 
// https://stackoverflow.com/questions/16144455/mocha-tests-with-extra-options-or-parameters


// console.log(process.argv);

const loadDB = async () => {
  if (data) {
      return data;
  }
  try {
      const client = await mongo.connect('mongodb://localhost:27017/apiTest', connectConfig);
      data = client.db('apiTest');
  } catch (err) {
      throw err;
  }
  return data;
};

const populateDB = async () => {

  let players = [];

  try {
      const client = await mongo.connect('mongodb://localhost:27017/apiTest', connectConfig);
      data = client.db('apiTest');

      data.collection('player').insertMany(getPlayerData(), function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        // console.log('KFKFKFKFKFKKFKFKFK')
        // console.log(result);
        return players;
        
      });

  } catch (err) {
      throw err;
  }
  
};

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
const emptyDB = async () => {

  let players = [];

  try {
      const client = await mongo.connect('mongodb://localhost:27017/apiTest', connectConfig);
      data = client.db('apiTest');

      data.collection('player').deleteMany({}, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        };

        return [];
        
      });

  } catch (err) {
      throw err;
  }
  
};

function initDB() {
  mongo.connect(url, connectConfig, (err, client) => {
    if (err) throw err;
    initCollections(client);
    console.log(`Connected to database: ${dbName}.`);     
  });
}

async function initCollections(client) {
  const existingCollections = await client.db().listCollections().toArray();
  const collectionsToInit = collectionNamesToInit();
  const db = client.db(dbName);
  addCollectionsToDatabaseIfDoesNotExist(db, collectionsToInit, existingCollections)
}

function addCollectionsToDatabaseIfDoesNotExist(db, collectionsToInit, existingCollections) {
    collectionsToInit.map(col => {

      if(!collectionExists(col, existingCollections)) {  
          db.createCollection(col, function(err, res) {
            if (err) throw err;
            console.log(`Collection created: ${col}.`);  
        });
      }
    
   });
}

function collectionNamesToInit(){
  return ['player', 'dashboard'];
}

function collectionExists(collection, existingCollections) {
    return existingCollections.find(col => collection === col.name); 
}

function getUrl() {
    return url;
}

function getDBName() {
    return dbName;
}

module.exports.getUrl = getUrl;
module.exports.getDBName = getDBName;
module.exports.initDB = initDB;
module.exports.loadDB = loadDB;
module.exports.populateDB = populateDB;
module.exports.emptyDB = emptyDB;
module.exports.getPlayerData = getPlayerData;