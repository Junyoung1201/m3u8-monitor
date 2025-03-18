import { setFileName, updateM3u8 } from "store/info";
import { store } from "store/store";
import Strings from "strings";
import { I_M3u8Item } from "types/m3u8";

export async function downloadVideo({fileName,url}: I_M3u8Item, videoOutputPath: string) {

    console.log(`영상 다운로드 시작 (${fileName}) (출력 경로: ${videoOutputPath})`);

    store.dispatch(updateM3u8({url, status: Strings.STATUS_DOWNLOADING}))

    let rs = await window.electron.invoke('download', {
        fileName,url,outputPath:videoOutputPath
    });

    if(!rs.success) {
        console.error(`다운로드 실패 (${fileName}): ${rs.message}`)
        store.dispatch(updateM3u8({url, status: Strings.STATUS_DOWNLOAD_ERROR}));
    } else {
        if(rs.message !== fileName) {
            console.log(`파일 이름 변경: ${fileName} --> ${rs.message}`);
            fileName = rs.message;
        }
        
        let filePath = videoOutputPath+"\\"+fileName;

        store.dispatch(updateM3u8({url, fileName, filePath,status: Strings.STATUS_DOWNLOAD_FINISH}))
        console.log(`다운로드 완료 (${fileName},${filePath})`);
    }
}