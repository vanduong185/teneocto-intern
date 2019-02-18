var express = require("express");
var bodyParser = require("body-parser");
var db = require("./db");
const request = require("request");
const elasticsearch = require("elasticsearch");

var client = elasticsearch.Client({
  host: "localhost:9200"
});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/views2"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views2/index.html");
});

app.get("/words", function(req, res) {
  console.log(req.query);

  if (req.query) {
    params = req.query;

    query_str = "SELECT * FROM words LIMIT 100 OFFSET ?";
    db.query(query_str, [(params.page - 1) * 100], function(err, result) {
      if (err) {
        res.status(200).json({
          message: "Error"
        });
      }

      res.status(200).json({
        message: "ok",
        words: result
      });
    });
  }
});

app.get("/sentences", function(req, res) {
  console.log(req.query);

  if (req.query) {
    params = req.query;

    var query_str = {
      query: {
        match: {
          eng: {
            query: params.word,
            fuzziness: "auto"
          }
        }
      }
    };

    client.search(
      {
        index: "translation",
        type: "sentences",
        body: {
          query: {
            match: {
              eng: {
                query: params.word,
                fuzziness: "auto"
              }
            }
          }
        }
      },
      function(err, response) {
        //console.log(body)
        //body = JSON.parse(body);
        console.log(response);
        data = response.hits.hits.splice(0, 10);
        console.log(data);
        res.status(200).json({
          message: "ok",
          data: data
        });
      }
    );
  }
});

app.listen(8000, function() {
  console.log("App listening on port 8000!");
});
