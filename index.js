var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// create application/json parser
var jsonParser = bodyParser.json() 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

require('dotenv').config()

app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.get('/', function(request, response) {
  var env = process.env.APP_ENV;
  if (env == 'staging') {
    var envName = 'staging'
  } else if (env == 'production') {
    var envName = 'production'
  } else {
    var envName = 'review app'
  }
  response.render('index.html', { env: envName});
});

app.post("/new_contact", urlencodedParser, function(req, res) {
  console.log(JSON.stringify(req.body));
    var notification = req.body["soapenv:envelope"]["soapenv:body"][0]["notifications"][0];
    var sessionId = notification["sessionid"][0];
    var data = {};
    if (notification["notification"] !== undefined) {
      var sobject = notification["notification"][0]["sobject"][0];
      Object.keys(sobject).forEach(function(key) {
        if (key.indexOf("sf:") == 0) {
          var newKey = key.substr(3);
          data[newKey] = sobject[key][0];
        }
      }); // do something #awesome with the data and sessionId
    }
    res.status(201).end();
  }); 

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app
