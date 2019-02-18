<template>
  <div id="app">
    <!-- <b-pagination size="md" :total-rows="100" :per-page="10">
    </b-pagination>-->
    <div class="row">
      <div class="col-md-2" v-for="word in words">
        <div class="item">
          <span class="word-eng pointer" @click="show_sentences(word)">{{ word.eng }}</span>
          <br>
          <span v-if="word.phonetic.length > 0" class="word-phonetic">{{"/" + word.phonetic + "/"}}</span>
          <br>
          <span class="word-vie">{{ word.vie }}</span>
          <div class="sound hover-display">
            <font-awesome-icon icon="volume-up" @click="play(word.eng)"/>
          </div>
          <div class="d-none">
            <audio v-bind:id="'audio' + word.id" controls>
              <!-- <source v-bind:src="word.sound" type="audio/mpeg"> -->
            </audio>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2 float-right">
      <b-pagination
        size="md"
        v-bind:total-rows="total_word"
        per-page="100"
        v-model="page"
        @input="getWord()"
      ></b-pagination>
    </div>

    <div class="mt-2 float-left">
      <!-- <download-excel
        class="btn btn-default"
        :data="json_data"
        :fields="json_fields"
        worksheet="my-ws"
        name="hello.xls"
      >export</download-excel>-->
      <button class="btn btn-default" v-on:click="downloadExcel">Excel download</button>
      <button class="btn btn-default" v-on:click="downloadPDF">PDF download</button>
    </div>

    <b-modal ref="myModalRef" hide-footer v-bind:title="selected_word.eng">
      <div class="d-block">
        <span
          v-if="selected_word.phonetic.length > 0"
          class="word-phonetic mr-3"
        >{{"/" + selected_word.phonetic + "/"}}</span>
        <span class="word-vie">{{ selected_word.vie }}</span>
      </div>
      <div class="mt-3">
        <div v-for="s in sentences" class="mb-2">
          <span class="sentences-eng mr-2">{{ s.eng }}</span>
          <font-awesome-icon icon="volume-up" class="pointer" @click="play_sentence(s.soundId)"/>
          <br>
          <span class="sentences-vie">{{ s.vie }}</span>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "app",
  data() {
    return {
      words: [],
      total_word: 86800,
      page: 1,
      selected_word: {
        eng: "",
        phonetic: "",
        vie: "",
        sound: ""
      },
      sentences: [{ eng: "", vie: "", soundId: "" }],
      data_excel: []
    };
  },
  mounted() {
    self = this;

    this.$http.get("/words", { params: { page: 1 } }).then(res => {
      self.words = res.body.words;
    });
  },
  methods: {
    getWord: function() {
      self = this;

      this.$http.get("/words", { params: { page: self.page } }).then(res => {
        self.words = res.body.words;
      });
    },
    play: function(word_eng) {
      console.log(word_eng);

      // if (document.getElementById("audio" + word_id)) {
      //   document.getElementById("audio" + word_id).load();
      //   document.getElementById("audio" + word_id).load();
      // }
      var audio = new Audio(
        `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${word_eng}`
      );
      audio.play();
    },
    play_sentence: function(soundId) {
      var audio2 = new Audio(
        `https://audio.tatoeba.org/sentences/eng/${soundId}.mp3`
      );
      audio2.play();
    },
    show_sentences: function(word) {
      console.log(word);

      self = this;

      this.selected_word = word;

      this.$refs.myModalRef.show();

      this.$http.get("/sentences", { params: { word: word.eng } }).then(res => {
        console.log(res.body);
        self.sentences = [];
        // for (d of res.body.data) {
        //   self.sentences.push(d._source)
        // }

        res.body.data.forEach(e => {
          console.log(e);
          self.sentences.push(e._source);
        });
      });
    },
    downloadExcel: function() {
      self = this;

      for (let w of self.words) {
        var res = this.$http
          .get("/sentences", {
            params: { word: w.eng }
          })
          .then(res => {
            console.log(res.body.data);

            // for (d of res.body.data) {
            //   self.sentences.push(d._source)
            // }
            //sentences = res.body.data;
            setTimeout(() => {
              for (let s of res.body.data) {
                let data = {
                  word_english: w.eng,
                  word_phonetic: w.phonetic,
                  word_vietnamese: w.vie,
                  sentence_eng: s._source.eng,
                  sentences_vie: s._source.vie
                };

                console.log(data);
                self.data_excel.push(data);
              }
            }, 1000);
          });
      }

      setTimeout(() => {
        console.log(self.data_excel);

        var data = XLSX.utils.json_to_sheet(self.data_excel);

        var wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, data, "translation");

        XLSX.writeFile(wb, "translation.xlsx");
      }, 3000);
    },
    downloadPDF: function() {}
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

a {
  color: #42b983;
}

.item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.item:hover {
  background-color: lightskyblue;
}

.item:hover .hover-display {
  display: block;
}

.hover-display {
  display: none;
}

.sound {
  position: absolute;
  top: 10px;
  right: 50px;
  font-size: 24px;
  cursor: pointer;
}

.word-eng {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.word-vie {
  font-size: 14px;
  font-weight: 200;
  color: slategrey;
}

.word-phonetic {
  font-size: 14px;
  font-weight: 200;
  color: #aaa;
  margin-bottom: 20px;
}

.pointer {
  cursor: pointer;
}

.sentences-eng {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
}

.sentences-vie {
  font-size: 14px;
  font-weight: 100;
  margin-bottom: 10px;
}
</style>
