import ChildProcess from 'child_process';
import fs from 'fs-extra';
import Variables from '../variable';
import path from 'path';

export default class Downloader {

    private static procList: any[] = [];

    static async killAll() {
        Downloader.procList.forEach(proc => {
            proc.kill();
        })
    }

    static async download(url: string, outputPath: string, fileName: string): Promise<{ success: boolean, message?: string }> {

        let ffmpegPath = path.join(Variables.rootDir, 'bin', 'ffmpeg.exe');

        if(!url || !outputPath || !fileName) {
            return {
                success: false,
                message: "올바르지 않은 요청입니다."
            }
        }

        if(!await fs.exists(ffmpegPath)) {
            return {
                success: false,
                message: "ffmpeg.exe를 찾을 수 없습니다."
            }
        }

        if(!await fs.exists(outputPath)) {
            return {
                success: false,
                message: "출력 폴더를 찾을 수 없습니다."
            }
        }

        if(!(await fs.stat(outputPath)).isDirectory()) {
            return {
                success: false,
                message: "출력 경로는 폴더여야 합니다."
            }
        }

        let fIndex = 0;
        let fileBaseName = path.parse(fileName).name;
        let newFileName = fileBaseName+".mp4";
        let outputFile = path.join(outputPath,newFileName);

        while(await fs.exists(outputFile)) {
            newFileName = fileBaseName+` (${++fIndex}).mp4`;

            outputFile = path.join(outputPath,newFileName);
            console.log(`파일 이름(${fileName})이 이미 존재하므로 이름 수정 시도: ${newFileName}`);
        }

        console.log(`[ffmpeg] 다운로드 시작 (url: ${url}, outputFile: ${outputFile})`)

        let proc = ChildProcess.spawn(ffmpegPath, [
            "-i",url,
            "-c","copy",
            "-bsf:a","aac_adtstoasc",
            "-f","mp4",
            outputFile
        ], {
            shell: true,
            windowsHide: true
        })

        return new Promise((resolve,reject) => {

            proc.stdout.on('data', (message) => {
                console.log('[ffmpeg]:',message.toString());
            });

            proc.stderr.on('data', (err) => {
                console.error("[ffmpeg]:",err.toString());
            })

            proc.on('close', (code) => {
                console.log("[ffmpeg] 다운로드 완료:", outputFile,"exit code:",code);

                // procList에서 프로세스 제거
                Downloader.procList = Downloader.procList.filter(p => p.pid !== proc.pid);
                
                resolve({ success: true, message: newFileName })
            })
        })
    }
}