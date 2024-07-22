const { app, BrowserWindow, ipcMain, nativeTheme, shell } = require("electron");
const path = require("node:path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainwindow = null;

const createWindow = () => {
  // Create the browser window.
  mainwindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,

    title: "Password Manager",
    icon: "./public/favico.ico",

    autoHideMenuBar: true,
    frame: false,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      enableRemoteModule: false,

      // make false when app is ready to build
      devTools: false,
      preload: path.join(__dirname, "src/main_preload.js"),
    },
  });

  // and load the index.html of the app.
  mainwindow.loadFile(path.join(__dirname, "public/main.html"));

  // Open the DevTools.
  // mainwindow.webContents.openDevTools();

  mainwindow.on("ready-to-show", () => {
    mainwindow.show();
  });

  mainwindow.on("maximize", () => {
    mainwindow.webContents.send("win:maximize");
  });

  mainwindow.on("unmaximize", () => {
    mainwindow.webContents.send("win:unmaximize");
  });

  mainwindow.on("restore", () => {
    mainwindow.webContents.send("win:resotre");
  });

  // mainwindow.webContents.on("did-finish-load", () => {
  //   mainwindow.webContents.insertCSS(`
  //       @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
  //       @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

  //     `);
  // });

  const webContent = mainwindow.webContents;

  webContent.on("did-finish-load", async () => {
    try {
      await webContent.debugger.sendCommand("Autofill.enable");
      console.log("Autofill enabled");
      await webContent.debugger.sendCommand("Autofill.setAddresses");
      console.log("Autofill addresses set");
    } catch (error) {
      console.error("Error enabling Autofill or setting addresses:", error);
    }
  });
};

ipcMain.handle("dark-mode:toggle", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("win:minimize", () => {
  mainwindow.minimize();
});

ipcMain.handle("win:maxi_restore", () => {
  if (!mainwindow.isMaximized()) mainwindow.maximize();
  else mainwindow.restore();

  return mainwindow.isMaximized();
});

ipcMain.handle("win:isMaximized", () => {
  return mainwindow.isMaximized();
});

ipcMain.on("win:close", () => {
  mainwindow.close();
});

ipcMain.on("external:links", (event, url) => {
  shell.openExternal(url);
});
