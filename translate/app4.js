const csv = require("csv-parser");
const fs = require("fs");

var eng_sentences = [];
eng_sentences = JSON.parse(fs.readFileSync("eng_data2.json", "utf8"));

var vie_sentences = [];
vie_sentences = JSON.parse(fs.readFileSync("vie_data.json", "utf8"));

var translate_sentences = [];

var prev_sentence = {
  id: -1,
  content: null
}

fs.createReadStream("test4.csv").pipe(csv()).on('data', function (data) {
  try {
    link = Object.values(data)[0].split("\t");
    console.log(link[0])
    if (link[0] != prev_sentence.id) {
      var is_english = false;
      var eng = null;
      for (e of eng_sentences) {
        if (e.id == link[0]) {
          is_english = true;
          console.log("is e")
          prev_sentence.id = e.id;
          prev_sentence.content = e.content;
          prev_sentence.is_english = true;

          eng = {
            id: e.id,
            content: e.content
          }
          break;
        }
      }

      if (is_english && eng != null) {
        prev_sentence.have_vie = false;

        for (v of vie_sentences) {
          if (link[1] == v.id) {
            if (prev_sentence.is_english) prev_sentence.have_vie = true;

            var translation = {
              eng: eng.content,
              vie: v.content,
              soundId: eng.id,
              syllables: eng.content.split(" ").length
            }
            console.log(translation)
            translate_sentences.push(translation)
            break;
          }
        }
      }
      else {
        prev_sentence = {
          id: link[0],
          is_english: false,
          have_vie: false
        }
      }
    }
    else {
      if (prev_sentence.is_english == true && prev_sentence.have_vie == false) {
        for (v of vie_sentences) {
          if (v.id == link[1]) {
            if (prev_sentence.is_english) prev_sentence.have_vie = true;

            var translation = {
              eng: prev_sentence.content,
              vie: v.content,
              soundId: prev_sentence.id,
              syllables: prev_sentence.content.split(" ").length
            }
            console.log(translation)
            translate_sentences.push(translation)
            break;
          }
        } 
      }
    }
  }
  catch (err) {

  }
}).on('end', function () {
  fs.writeFileSync("translate2.json", JSON.stringify(translate_sentences))
});