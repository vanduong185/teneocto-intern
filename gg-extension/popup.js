var app = new Vue({
  el: "#app",
  data: {
    accounts: []
  },
  methods: {
    getAccounts: function (callback) {
      var self = this;
      self.accounts = [];
      db.collection("fb_acc").get().then(snap => {
        snap.forEach(doc => {
          acc = doc.data();
          self.accounts.push(acc);
        })
        if (callback) callback(self.accounts)
      })
    },
    getCookies: function (domain, callback) {
      chrome.cookies.getAll({ "domain": domain }, function (cookie) {
        if (callback) {
          callback(cookie);
        }
      });
    },
    clearCookies: function (domain, callback) {
      self = this;
      chrome.cookies.getAll({ "domain": domain }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
          chrome.cookies.remove({
            "url": "https://.facebook.com" + cookies[i].path,
            "name": cookies[i].name
          });
        }

        self.refreshCurrentTab();
      });
    },
    changeAccount: function (account) {
      console.log(account);

      var self = this;
      var cur_acc;

      // chrome.cookies.getAll({ domain: ".facebook.com" }, function (cookies) {
      //   for (i = 0; i < cookies.length; i++) {
      //     if (cookies[i].name == "c_user") {
      //       cur_acc = cookies[i].value;
      //     }
      //   }

      //   for (i = 0; i < cookies.length; i++) {
      //     if (cookies[i].name == "xs") {
      //       db.collection("fb_acc").doc(cur_acc).update({
      //         cookies: {
      //           xs: cookies[i]
      //         }
      //       })
      //     }
      //   }

        self.getAccounts(function (accounts) {
          console.log(accounts);
          for (i = 0; i < accounts.length; i++) {
            if (accounts[i].cookies.c_user.value == account.cookies.c_user.value) {
              var acc = accounts[i];
            }
          }
          for (var item in acc.cookies) {
            cookie = acc.cookies[item];
            chrome.cookies.set({
              "url": "https://.facebook.com" + cookie.path,
              "name": cookie.name,
              "value": cookie.value,
              "secure": cookie.secure,
              "expirationDate": cookie.expirationDate,
              "httpOnly": cookie.httpOnly,
              "path": cookie.path,
              "sameSite": cookie.sameSite,
              "storeId": cookie.storeId,
            }, function (cookie) {
              console.log(JSON.stringify(cookie));
            });
          }

          self.refreshCurrentTab();
        });
      // })
    },
    refreshCurrentTab: function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: "https://facebook.com" });
      });
    }
  },
  mounted: function () {
    var self = this;

    window.addEventListener("DOMContentLoaded", function () {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        //get cookies of facebook
        self.getCookies(".facebook.com", function (chrome_cookies) {
          var current_acc = {
            avatar: "",
            username: "",
            cookies: {}
          }

          //set cookie for current_acc model
          chrome_cookies.forEach(c => {
            if (c.domain == ".facebook.com" && c.name != "dbln" && c.name != "act") {
              current_acc.cookies[c.name] = c
            }
          });

          //get userinfo of facebook page if logged in
          if (current_acc.cookies.c_user) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                from: "popup",
                subject: "UserInfo",
                acc_id: current_acc.cookies.c_user.value
              },
              function (response) {
                console.log(response)
                if (response.message == "done") {
                  current_acc.avatar = response.avatar;
                  current_acc.username = response.username;

                  //check account already exist in db
                  db.collection("fb_acc").where("cookies.c_user.value", "==", current_acc.cookies.c_user.value).get().then(snap => {
                    if (snap.docs.length <= 0) {
                      console.log("set new acc");
                      db.collection("fb_acc").doc(current_acc.cookies.c_user.value).set(current_acc).then(snap => {
                        self.getAccounts();
                      });
                    }
                    else {
                      db.collection("fb_acc").doc(current_acc.cookies.c_user.value).update(current_acc).then(() => {
                        self.getAccounts();
                      })
                    }
                  })
                }
                else {
                  self.getAccounts();
                }
              }
            )
          }
          else {
            self.getAccounts();
          }
        })
      })
    });
  }
})
