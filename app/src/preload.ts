import 'module-alias/register';

import { ipcRenderer, contextBridge } from "electron";
import { Config } from "modules/config";

console.log('preload 스크립트 로드됨.')

contextBridge.exposeInMainWorld('electron', {

    clearIpc() {
        ipcRenderer.removeAllListeners();
    },

    send(channel: string, data: any) {
        ipcRenderer.send(channel, data)
    },

    receive(channel: string, callback: (data: any) => void) {
        ipcRenderer.on(channel,(l,data) => {
            callback(data)
        });
    },
    
    async invoke(channel: string, data: any) {
        return await ipcRenderer.invoke(channel, data)
    },

    test() {
        ipcRenderer.send("test", "preload");
    }
})