import path from 'path';
import fs from 'fs-extra';
import { I_Config } from 'types/config';
import Variables from '../variable';
import Logger from 'types/logger';

const VIDEO_DOWNLOAD_PATH_DEF = path.join("A:","Elurim","Videos");
const CONFIG_PATH = path.join(Variables.rootDir, "config.json");

export class Config {

    static async load() {
        const logger = new Logger("Config.load");

        if(!await fs.exists(CONFIG_PATH)) {
            let config = await Config.save(undefined);
            logger.log(`파일이 없으므로 새로 작성함`,CONFIG_PATH)
            return config;
        } else {
            logger.log("설정 불러옴.")
            return await fs.readJSON(CONFIG_PATH, "utf-8");
        }
    }

    static async save(config: I_Config | undefined) {

        const logger = new Logger("Config.save");

        let videoOutputPath = config?.videoOutputPath ?? VIDEO_DOWNLOAD_PATH_DEF

        config = {
            videoOutputPath,
        }

        let str = JSON.stringify(config, null, 2)
        
        try {
            await fs.ensureFile(CONFIG_PATH);
            await fs.writeFile(CONFIG_PATH, str, {"encoding": "utf-8"});

            logger.log("설정 파일 작성함.")

            return config;

        } catch (e) {
            logger.error("설정 파일 작성 실패:",e);
            return {};
        }
    }
}