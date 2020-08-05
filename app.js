const express = require('express')
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', require('./routes'));;

app.listen(8080, function () {
  console.log('App listening on port 8080!')
})

module.exports = app;