import Variables from "../variable";
import { io } from "./socket-io";

/**
 *  통신 관리 모듈
 */
export default class CommuManager {
    static sendToRenderer(channel: string, data?: any) {
        Variables.MAIN_WINDOW.webContents.send(channel, data);
        console.log(`[CommuManager.sendToRenderer] 채널: "${channel}", 데이터:`,data);
    }

    static sendToChrome(action: string, data?: any) {
        io.emit(action, data);
        console.log(`[CommuManager.sendToChrome] action: "${action}", 데이터:`,data);
    }
}