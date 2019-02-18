const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain, ipcRenderer } = require('electron');

let win;
var checker = true;
var i = 0;

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 600,
     webPreferences: {
      preload: path.join(__dirname, "./views/scripts/test.js")
    }
  });
  // win.loadURL(url.format( {
  //   pathname: path.join(__dirname, "./views/index.html"),
  //   protocol: "file:",
  //   slashes: true
  // }))
  win.loadURL('https://translate.google.com')
  //win.webContents.openDevTools();
  
  win.webContents.on('did-stop-loading', () => {
    if (checker) {
      win.webContents.send("go", {index: 0});
    }
    checker = false
  })
}

app.on('ready', createWindow);

ipcMain.on('err-message', (event, message) => {
  win.webContents.session.clearStorageData( function() {
    win.webContents.send("go", {index: message.index});
  });
})