import { BrowserWindow } from "electron";

export default class Variables {
    static rootDir = __dirname;
    static MAIN_WINDOW: BrowserWindow;
}