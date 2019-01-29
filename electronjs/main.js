const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const request = require("request");
const { ipcMain, ipcRenderer } = require('electron');
const fs = require("fs");

let win;
var obj;
var checker = true;
var i = 0;

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 600, webPreferences: {
      preload: path.join(__dirname, "./views/scripts/test.js")
    }
  });
  // win.loadURL(url.format( {
  //   pathname: path.join(__dirname, "./views/index2.html"),
  //   protocol: "file:",
  //   slashes: true
  // }))
  win.loadURL('https://translate.google.com')
  win.webContents.openDevTools();
  
  win.webContents.on('did-stop-loading', () => {
    //win.webContents.executeJavaScript('myTools.getData()')
    // fs.readFile('data.json', 'utf8', function (err, data) {
    //   if (err) throw err;
    //   obj = JSON.parse(data);
    //   obj.splice(5, 86800)

    //   for (word of obj) {
    //     console.log(word.en)
    //     win.webContents.send("hey", word.en)
    //     //win.webContents.executeJavaScript('myTools.getData()');
    //   }
    //   //process(obj, win)
    // });
    if (checker) {
      win.webContents.send("go", {index: 0});
    }
    checker = false
  })
  


}

function process(data, win) {
  setTimeout(() => {
    word = data[i];
    //win.loadURL("https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=" + word.en);
    console.log(word)
    win.webContents.send("hey", word.en)
    i++;
    if (i < data.length) {
      process(data, win)
    }

  }, 3000)
}

app.on('ready', createWindow);

ipcMain.on('err-message', (event, message) => {
  win.webContents.session.clearStorageData( function() {
    win.webContents.send("go", {index: message.index});
  });
})