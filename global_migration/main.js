const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron');

// Module to create native browser window.

var {app2, BrowserWindow2, ipcMain} = electron;
var floorWindow = null;
var mainWindow = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  var screenElectron = electron.screen;
  var mainScreen = screenElectron.getPrimaryDisplay();
  var allScreens = screenElectron.getAllDisplays();
  var wallScreen = null;
  var floorScreen = null;
  // Identify screens for display
  if (allScreens[0].size.width > allScreens[1].size.width){
    wallScreen = allScreens[0];
    floorScreen = allScreens[1];
  } else {
    floorScreen = allScreens[0];
    wallScreen = allScreens[1];
  }
  console.log(mainScreen, allScreens);


  // Create the browser window.
  mainWindow = new BrowserWindow({  frame:false, width: wallScreen.size.width, height: wallScreen.size.height, webPreferences:{nodeIntegration: true}})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'wall.html'),
    protocol: 'file:',
    slashes: true
  }))
  console.log(floorScreen.size.height);
  console.log(floorScreen.size.width);
  mainWindow.webContents.openDevTools()

  floorWindow = new BrowserWindow({ frame:false, x:  ((1920-1080)/2)-1920, y:0,width : 1080,height: 800})

  floorWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'floor.html'),
    protocol: 'file:',
    slashes: true
  }))

    floorWindow.setFullScreen(true);
    mainWindow.setFullScreen(true);

  ipcMain.on('request change', (event, arg) => {
    floorWindow.webContents.send('sendyear',arg);
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    floorWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
