const { ipcRenderer } = require('electron')
const fs = require("fs");

global.arr = [];

fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  global.words = obj;
})

//ipcRenderer.sendSync('synchronous-message', 'sync ping')


// ipcRenderer.on("hey", (event, message) => {
//   console.log(message);
//   window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + message;
//   // // var c = document.querySelector(".translation span").textContent
//   // // console.log(document.querySelector(".translation span").textContent);
//   // // global.a.push(c)
// })

ipcRenderer.on("go", (e, message) => {
  a = global.words;
  a.splice(1000, 86800)
  var i = message.index;
  var isTranslating = false;
  var cur = "";
  var t = setInterval(function () {
    word = a[i];
    is_new_word = false;
    if (isTranslating == false) {
      console.log("set value")
      window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + word.en;
    }
    isTranslating = true;

    console.log(i);

    if (document.querySelector(".translation span")) {
      var vi = document.querySelector(".translation span").textContent;
      if (cur != vi) {
        cur = vi;
        word.vi = vi;
        word.sound = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=gtx&q=' + word.en;
        if (document.querySelector(".transliteration-content")) {
          word.phonetic = document.querySelector(".transliteration-content").textContent;
        }
        isTranslating = false;
        global.arr.push(word);
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

    if (i >= a.length - 1) {
      clearInterval(t);
      fs.writeFileSync("translate.json", JSON.stringify(global.arr));
    }
  }, 100)

  // var t2 = setInterval(function () {
  //   error_tag = document.querySelector(".result-error .error-placeholder");
  //   if (error_tag) {
  //     console.log("error detected");
  //     ipcRenderer.send("err-message")
  //   } 
  //   else {
  //     //console.log("not error")
  //   }
  // }, 100)
})

function process(data, i) {
  // setTimeout(() => {
  //   console.log(i);
  //   word = data[i];
  //   window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + word.en;
  //   console.log(word)
  //   i++;
  //   if (i < data.length) {
  //     process(data, i)
  //   }
  // }, 3000)

  var time = setInterval(function () {
    word = data[i];
    window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + word.en;
    console.log(i)
    i++;
    if (i > data.length) {
      clearInterval(time)
    }
  }, 1000)
}



myTools = {
  getData: function () {
    console.log(document.querySelector(".translation span").textContent);
    text = document.querySelector(".translation span").textContent;
    fs.appendFileSync("a.json", text)
  }
}
