import { ipcMain } from "electron";
import Downloader from "./download";
import ChildProcess from 'child_process';
import path from "path";
import fs from 'fs-extra';
import { Config } from "./config";
import CommuManager from "./comu";
import Logger from "types/logger";

ipcMain.on('test', (l, [data]) => {
    console.log(`[ipc-main] hello world! test: ${data}`);
})

/*  
    정보(제목, 내용, 키워드 목록) 다시 불러오기 신호 받음  
    -> background.js에 reload-info 신호 전달
*/
ipcMain.on('reload-info', () => {
    CommuManager.sendToChrome('reload-info');
})

/**
 *  영상 다운로드 요청
 * @param url m3u8 url
 * @param outputPath 설정의 "videoOutputPath" 값
 * @param fileName 저장할 파일 이름
 */
ipcMain.handle('download', async (e, {url,outputPath,fileName}) => {
    return await Downloader.download(url,outputPath,fileName)
})

/**
 *  특정 경로 실행
 * 
 * @param targetPath 실행할 파일 또는 폴더 경로
 */
ipcMain.handle('open', async (e, targetPath: string) => {

    new Logger("ipc-main").log("open:",targetPath);

    if(await fs.exists(targetPath)) {

        let stat = await fs.stat(targetPath);

        if(stat.isDirectory()) {
            ChildProcess.exec(`explorer.exe "${targetPath}"`)    
        }

        else if(stat.isFile()) {
            ChildProcess.exec(`cmd.exe /k "${targetPath}"`)    
        }

        return {success:true}
    } else {
        return {success:false,message: "경로를 찾을 수 없습니다."};
    }
})

/**
 *  config.json을 읽고 설정 JSON 반환
 */
ipcMain.handle('load-config', async () => {
    try {
        let config = await Config.load();
        return {success:true,data:config};
    } catch (e) {
        console.error("설정을 불러오지 못함:",e);
        return {success:false,message:e.message};
    }
})

/**
 *  config.json에 설정 JSON 작성
 */
ipcMain.handle('save-config', async (e, config) => {

    try {
        await Config.save(config);
        return {success:true};
    } catch (e) {
        console.error("설정을 저장하지 못함:",e);
        return {success:false,message:e.message}
    }
})