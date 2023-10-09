const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("os");
const username = os.userInfo().username;
const fs = require("fs");
const contacts = require("node-mac-contacts");
const {
  askForFullDiskAccess,
  askForContactsAccess,
} = require("node-mac-permissions");

//askForFullDiskAccess();
//askForContactsAccess();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("request-contact-access", (event) => {  
  contacts.requestAccess()
  const authStatus = contacts.getAuthStatus();
  console.log(`Authorization access to contacts is: ${authStatus}`);
  const allContacts = contacts.getAllContacts()
  console.log(allContacts[0])
});

ipcMain.on("request-disk-access", (event) => {
  askForFullDiskAccess();
});

try {
  require("electron-reloader")(module);
} catch (_) {}
