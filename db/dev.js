const mongo = require('mongodb').MongoClient
const dbName = 'apiDev'
const url = `mongodb://127.0.0.1:27017/${dbName}`

let data  = null;
const connectConfig = { useNewUrlParser: true, useUnifiedTopology: true }

// TODO make one db config file. 
// https://stackoverflow.com/questions/16144455/mocha-tests-with-extra-options-or-parameters


console.log(process.argv);

const loadDB = async () => {
  if (data) {
      return data;
  }
  try {
      const client = await mongo.connect('mongodb://localhost:27017/apiDev', connectConfig);
      data = client.db('apiDev');
  } catch (err) {
      throw err;
  }
  return data;
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