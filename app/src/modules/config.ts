import path from 'path';
import fs from 'fs-extra';

const VIDEO_DOWNLOAD_PATH_DEF = path.join("A:","Elurim","Videos");

export class Config {

    private static videoDownloadPath: string = VIDEO_DOWNLOAD_PATH_DEF;
    
    static getVideoDownloadPath() {
        return Config.videoDownloadPath;
    }

    static async setVideoDownloadPath(str: string) {
        Config.videoDownloadPath = str;
        console.log("영상 다운로드 폴더 변경:",str);
        await Config.save();
    }

    static async load() {
        if(await fs.pathExists("config.json")) {
            let configStr = await fs.readFile("config.json", "utf-8");
            let {videoDownloadPath} = JSON.parse(configStr);
            
            Config.videoDownloadPath = videoDownloadPath ?? VIDEO_DOWNLOAD_PATH_DEF;
            
            console.log("설정을 불러옴.")
        } else {
            await Config.save();
        }
    }

    static async save() {
        let str = JSON.stringify({
            videoDownloadPath: Config.videoDownloadPath
        })
        
        await fs.writeFile("config.json", str);

        console.log("설정 파일 작성함.")
    }
}