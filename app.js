const express = require('express')
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.type('json');
  next();
});

app.use('/api', require('./api'));;

app.listen(8080, function () {
  console.log('App listening on port 8080!')
})

module.exports = app;