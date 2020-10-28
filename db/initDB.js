const mongo = require('mongodb').MongoClient

let dbName = ''
let url = `mongodb://127.0.0.1:27017/${dbName}`

const connectConfig = { useNewUrlParser: true, useUnifiedTopology: true }

initDB(resolveEnv());

function resolveEnv() {
  return process.argv[2];
}

function initDB(env) {
    setupParams(env);

    console.log('Starting the initialization of ' + env + ' db');

    mongo.connect(url, connectConfig, (err, client) => {
      if (err) throw err;
      initCollections(client);
      console.log(`Connected to database: ${dbName}.`); 
      // TODO exit gracefully 
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

function setupParams(env) {
  dbName = env;
}
