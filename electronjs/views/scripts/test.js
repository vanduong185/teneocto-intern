const { ipcRenderer } = require('electron')
const fs = require("fs");

global.arr = [];


fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  global.words = obj;
  //global.a = global.words
  global.a = global.words.splice(28527, 2183);
  console.log(global.a)
})

// var data = fs.readFileSync("data.json", "utf8");
// global.words = JSON.parse(data);




//ipcRenderer.sendSync('synchronous-message', 'sync ping')


// ipcRenderer.on("hey", (event, message) => {
//   console.log(message);
//   window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + message;
//   // // var c = document.querySelector(".translation span").textContent
//   // // console.log(document.querySelector(".translation span").textContent);
//   // // global.a.push(c)
// })

var writeStream = fs.createWriteStream('add.json');

writeStream.write("[");

writeStream.on('finish', () => {
  console.log('wrote all data to file');
});

ipcRenderer.on("go", (e, message) => {
  
  var i = message.index;
  var isTranslating = false;
  var cur_vi = "";
  var cur_en = "";

  var t = setInterval(function () {
    console.log(i)
    word = global.a[i];
    if (isTranslating == false) {
      window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + word.en;
    }
    isTranslating = true;

    if (document.querySelector(".translation span")) {
      // var vi = document.querySelector(".translation span").textContent;
      // if (cur_vi != vi) {
      //   cur_vi = vi;
      //   word.vi = vi;
      //   word.sound = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=gtx&q=' + word.en;
      //   if (document.querySelector(".transliteration-content")) {
      //     word.phonetic = document.querySelector(".transliteration-content").textContent;
      //   }
      //   isTranslating = false;
      //   writeStream.write(JSON.stringify(word) + ",");
      // }
      var en = document.querySelector("#source").value;
      var vi = document.querySelector(".translation span").textContent;
      if (cur_en != en) {
        cur_en = en;
        word.vi = vi;
        word.sound = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=gtx&q=' + word.en;
        if (document.querySelector(".transliteration-content")) {
          word.phonetic = document.querySelector(".transliteration-content").textContent;
        }
        isTranslating = false;
        writeStream.write(JSON.stringify(word) + ",");
      }
    }

    if (isTranslating == false) i++;

    error_tag = document.querySelector(".result-error .error-placeholder");
    if (error_tag) {
      console.log("error detected");
      clearInterval(t);
      cur_en = document.querySelector("#source").value;
      document.querySelector("#source").value = cur_en.split(cur_en[cur_en.length - 1]);
      ipcRenderer.send("err-message", { index: i })

    }
    else {
      //console.log("not error")
    }
    if (i >= global.a.length) {
      clearInterval(t);
      //fs.writeFileSync("translate.json", JSON.stringify(global.arr));
      writeStream.write("]");
      writeStream.end();
    }
  }, 50)
})
