import 'module-alias/register';
import path from 'path';
import { app, BrowserWindow } from "electron";
import Variables from "./variable";
import startSocketServer from 'modules/socket-io';
import 'modules/ipc-main';
import { Config } from "modules/config";
import Downloader from 'modules/download';

console.log("root:", Variables.rootDir,"preload:",path.join(__dirname, 'preload.js'))

function createMainWindow() {
    let win = new BrowserWindow({
        width: 435,
        height: 800,
        title: "M3U8 모니터",
        maximizable: false,
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    win.setMenuBarVisibility(false);
    
    if(!app.isPackaged) {
        win.loadURL("http://localhost:3000");
        win.webContents.openDevTools({ mode: "detach" });
    } else {
        win.loadFile("index.html");
    }

    // 새로고침 방지
    win.webContents.on("before-input-event", (ev, input) => {
        if (input.type === "keyDown" && (input.key === "F5" || (input.control && input.key === "r") || (input.meta && input.key === "r"))) {
            ev.preventDefault();
        }
    });

    Variables.MAIN_WINDOW = win;    
}

app.whenReady().then(async () => {
    console.clear();
    await Config.load();
    startSocketServer();
    createMainWindow();
})

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        Downloader.killAll();
        app.quit()
    }
})

app.on('before-quit', () => {
    Downloader.killAll();
})