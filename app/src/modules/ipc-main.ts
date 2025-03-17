import { ipcMain } from "electron";
import Variables from "../variable";
import Downloader from "./download";
import ChildProcess from 'child_process';
import path from "path";

ipcMain.on('test', (l, [data]) => {
    console.log(`[ipc-main] hello world! test: ${data}`);
})

ipcMain.handle('download', async (e, {url,outputPath,fileName}) => {
    return await Downloader.download(url,outputPath,fileName)
})

ipcMain.handle('play-video', (e, {outputPath, fileName}) => {
    ChildProcess.exec(`cmd.exe /k "${path.join(outputPath,fileName)}"`)    
})

ipcMain.handle('open-folder', (e, folderPath) => {
    ChildProcess.exec(`explorer "${folderPath}"`)    
})

export function sendToRenderer(channel: string, data?: any) {
    Variables.MAIN_WINDOW.webContents.send(channel, data);
}