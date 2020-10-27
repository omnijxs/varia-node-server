const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const dev = require('./db/persistence.js')
const test = require('./db/test.js')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.type('json');
  next();
});

app.use('/api', require('./api'));

app.listen(8080, function () {

  const env = resolveEnv();

  if(env === 'test'){
    console.log('Running in test')
  }

  if(env === 'dev') {
    console.log('Running in dev')
    dev.initDB();
  }

  console.log('App listening on port 8080!')
})

function resolveEnv() {
  return process.argv[2];
}

module.exports = app;



// Nhttps://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html