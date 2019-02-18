const csv = require("csv-parser");
const fs = require("fs");

var translations = [];
translations = JSON.parse(fs.readFileSync("completed_translations.json", "utf8"));
console.log(translations.length)
var completed_translations = [];

// fs.writeFileSync("completed_translations.json", "[");

// fs.createReadStream("/home/duongnv/Desktop/sentences_with_audio.csv").pipe(csv({ separator: '\n' })).on('data', function (data) {
//   try {
//     audio = Object.values(data)[0].split("\t");
//     //console.log(audio);

//     if (audio[3] == "http://www.manythings.org/tatoeba") {
//       for (t of translations) {
//         if (t.soundId == audio[0]) {
//           let completed_trans = t;
//           console.log(completed_trans);
//           fs.appendFileSync("completed_translations.json", JSON.stringify(completed_trans) + ",")
//           break;
//         }
//       }
//     }
//   }
//   catch (err) {
//     console.log("ERROR: ", err)
//   }
// }).on('end', function () {
//   fs.appendFileSync("completed_translations.json", "]")
// })