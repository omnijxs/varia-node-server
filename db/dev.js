const mongo = require('mongodb').MongoClient
const dbName = 'apiDev'
const url = `mongodb://127.0.0.1:27017/${dbName}`

const connectConfig = { useNewUrlParser: true, useUnifiedTopology: true }

mongo.connect(url, connectConfig, (err, client) => {
    if (err) throw err;
    initCollections(client);    
});

async function initCollections(client) {
  const existingCollections = await client.db().listCollections().toArray();
  const collectionsToInit = collectionNamesToInit();
  const db = client.db(dbName);
  addCollectionsToDatabaseIfDoesNotExist(db, collectionsToInit, existingCollections)
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

function getUrl() {
    return url;
}

function getDBName() {
    return dbName;
}

module.exports.getUrl = getUrl;
module.exports.getDBName = getDBName;