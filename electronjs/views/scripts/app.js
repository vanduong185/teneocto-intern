const request = require("request");

var app = new Vue({
  el: "#app",
  data: {
    words: [],
    keyword: "",
    originWord: {
      english: "",
      sound: null,
      phonetic: "",
      vietnamese: ""
    }
  },
  methods: {
    search: function () {
      self = this;
      if (self.keyword.length > 0) {
        this.$http.get('http://www.wordcount.org/dbquery.php?toFind=' + self.keyword + '&method=SEARCH_BY_NAME').then(res => {
          var data = res.body;
          data = data.split("&word");
          self.words = [];
          for (i = 2; i < data.length; i++) {
            tmp = data[i].split("&freq")[0];
            tmp = tmp.split("=");
            self.words.push(tmp[tmp.length - 1]);
          }
        })
      }
    },
    translate: function (word) {
      self = this;
      this.$http.get('https://translate.google.com/translate_a/single?client=gtx&sl=en&tl=vi&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&q=' + word).then(res => {
        data = res.body;
        self.originWord.english = word;
        self.originWord.vietnamese = data[0][0][0];
        if (data[0][1]) {
          self.originWord.phonetic = data[0][1][3];
        }
        else {
          self.originWord.phonetic = "" ;
        }
        self.originWord.sound = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=gtx&q=' + word;
        if (document.getElementById("sound")) {
          document.getElementById("sound").load()
        }
      })
    }
  },
  mounted: function () {
    var self = this;

    this.$http.get('http://www.wordcount.org/dbquery.php?toFind=0&method=SEARCH_BY_INDEX').then(res => {
      var data = res.body;
      data = data.split("&word");
      for (i in data) {
        tmp = data[i].split("&freq")[0];
        tmp = tmp.split("=");
        self.words.push(tmp[tmp.length - 1]);
      }

    })

    // this.$http.get("https://translate.google.com/translate_a/single?client=&sl=en&tl=vi&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&q=hello").then(res => {
    //   console.log(res)
    // })
  }
})