import { useEffect, useRef } from "react"
import { useSelector } from "react-redux";
import { RootState, store } from "store/store";
import { I_Config } from "types/config";
import './ConfigField.css';
import { getConfig } from "modules/config";

export default function ConfigField() {

    const videoOutputPathInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(videoOutputPathInputRef.current) {
            loadConfig();
        }
    },[videoOutputPathInputRef]);

    async function saveConfig() {
        let newConfig = getConfig();

        console.log("새로운 설정:",newConfig);

        let {success,message} = await window.electron.invoke('save-config',newConfig);

        console.log("새로운 설정을 저장함")

        if(!success) {
            alert(message);
            return false;
        } else {
            return true;
        }
    }

    async function loadConfig() {
        let {success,message,data} = await window.electron.invoke('load-config', undefined);

        console.log("설정을 로드함")

        if(!success) {
            alert(message);
            return false;
        } else {
            videoOutputPathInputRef.current!.defaultValue = data.videoOutputPath;
            return true;
        }
    }

    async function openOutputFolder() {
        let {videoOutputPath} = getConfig();
        let {success,message} = await window.electron.invoke('open', videoOutputPath)
        
        if(!success) {
            alert(message);
        }
    }

    return (
        <div data-no-clickable>
            <div className="title">영상 다운로드 경로</div>
            <div className="content settings">
                <input type="text" placeholder="영상 다운로드 경로를 입력해주세요." id="output-folder" ref={videoOutputPathInputRef} />

                <button onClick={openOutputFolder}>
                    <div>
                        <img src="img/icons/folder.png" alt="폴더 아이콘" />
                    </div>
                </button>

                <button onClick={saveConfig}>
                    <div>
                        <img src="img/icons/save.png" alt="저장 아이콘" />
                    </div>
                </button>

            </div>
        </div>
    )
}