var express = require("express");
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index_vuejs.html");
});

app.listen(8000, function () {
  console.log('App listening on port 8000!');
});
