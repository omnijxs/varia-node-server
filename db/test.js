const mongo = require('mongodb').MongoClient
const dbName = 'apiTest'
const url = `mongodb://127.0.0.1:27017/${dbName}`

// https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d
// https://www.codementor.io/@olatundegaruba/integration-testing-supertest-mocha-chai-6zbh6sefz 

// https://www.toptal.com/nodejs/integration-and-e2e-tests-nodejs-mongodb   

// https://codeisindna.com/2020/07/29/nodejs-and-mongodb-integration-using-mongoose/
// https://medium.com/kanssfer-consulting/testing-expressjs-rest-api-with-mocha-and-chai-90bf4178f15e

const Player = require('../data/player.js');

const connectConfig = { useNewUrlParser: true, useUnifiedTopology: true }

/* mongo.connect(url, connectConfig, async (err, client) => {
    if (err) throw err;
    await initCollections(client); 
    console.log(`Connected to database: ${dbName}.`);     
});*/ 

async function initCollections(client) {
  const existingCollections = await client.db().listCollections().toArray();
  const collectionsToInit = collectionNamesToInit();
  const data = client.db();
  addCollectionsToDatabaseIfDoesNotExist(data, collectionsToInit, existingCollections)
}

function addCollectionsToDatabaseIfDoesNotExist(db, 
                                               collectionsToInit, 
                                               existingCollections) {
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

async function connect() {
  return mongo.connect(url, connectConfig);
}

async function mockDB(){

  mongo.connect(url, connectConfig, async (err, client) => {
    if (err) throw err;
    const data = client.db(dbName); 

    const p1 = new Player('uuid_1', 'John Doe', 14240, 'BLUE', new Date('2020-08-20T00:00:00.000Z'));
    const p2 = new Player('uuid_2', 'Jane Doe', 11200, 'BLUE', new Date('2019-11-27T00:00:00.000Z'));
    const p3 = new Player('uuid_3', 'John Coe', 13200, 'RED', new Date('2019-04-01T00:00:00.000Z'));
    const p4 = new Player('uuid_4', 'George Doe', 12660, 'BLUE', new Date('2020-01-19T00:00:00.000Z'));
    const p5 = new Player('uuid_5', 'Jane Coe', 11700, 'RED', new Date('2020-02-15T00:00:00.000Z'));
    const p6 = new Player('uuid_6', 'George Coe', 15440, 'GREEN', new Date('2019-09-20T00:00:00.000Z'));
    const p7 = new Player('uuid_7', 'George Daffodil', 15440, 'PURPLE', new Date('2020-06-01T00:00:00.000Z'));
    const p8 = new Player('uuid_8', 'Mark Coe', 7800, 'PURPLE', new Date('2020-01-01T00:00:00.000Z'));
    const p9 = new Player('uuid_9', 'June Worth', 11420, 'PURPLE', new Date('2019-01-01T00:00:00.000Z'));
    const players = [p1, p2, p3, p4, p5, p6, p7, p8, p9];

    data.collection('player').insertMany(players, function(err, result) {
      if (err) {
          return res.status(500).send(err);
      };

      client.close();
      return res.status(200).send(result);
      
    });

      console.log(`FOOBAR: ${dbName}.`);     
  });

}

async function clearDB(){

  mongo.connect(url, connectConfig, async (err, client) => {
    const data = client.db(dbName);
    // await data.player.deleteMany({})
    return data;

  });
  
}

async function getDB(){

  const client = await connect();
  const data = client.db(dbName);

  return data;
}

module.exports.mockDB = mockDB;
module.exports.clearDB = clearDB;
module.exports.getDB = getDB;
