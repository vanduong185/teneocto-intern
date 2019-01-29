const request = require("request");
const fs = require("fs");

var words = [];

var word = {
  index: null,
  en: null,
}

var get_data = function (index) {
  console.log(index);
  request.get("http://www.wordcount.org/dbquery.php?toFind=" + index + "&method=SEARCH_BY_INDEX", { json: true }, (err, res, body) => {
    data = res.body;
    data = data.split("&word");
    for (i = 2; i < data.length; i++) {
      tmp = data[i].split("&freq")[0];
      tmp = tmp.split("=");
      var word = {
        index: null,
        en: null,
      }

      word.index = index + Number(tmp[0]);
      word.en = tmp[1];
      words.push(word);

    }

    index = index + data.length - 2;
    if (index < 86799) {
      get_data(index);
    }
    fs.writeFileSync("data.json", JSON.stringify(words));
    //console.log(JSON.stringify(words));
  })
}

get_data(0);

