const fs = require("fs");
const request = require("request");

var sentences = JSON.parse(
  fs.readFileSync("../translate/completed_translations.json", "utf8")
);

for (s of sentences) {
  request.post(
    {
      url: "http://localhost:9200/translation/sentences",
      json: s
    },
    function(error, response, body) {
      if (error) console.log("err")

      if (body) {
        //console.log(body)
      }
    }
  );
}
