import React, { useState } from "react";
import { useSelector } from "react-redux";
import { setFileName, setUrlStatus } from "store/info";
import { RootState, store } from "store/store";
import { I_UrlItem } from "types/url";

function UrlItem({fileName,url,status}: I_UrlItem) {
    const {videoOutputPath:outputPath} = useSelector((state: RootState) => state.info);

    function onClickCopyButton() {
        navigator.clipboard.writeText(url)
    }

    async function onClickDownloadButton() {
        store.dispatch(setUrlStatus({url, status: "downloading"}))
        console.log("다운로드 시작:",url)

        let rs = await window.electron.invoke('download', {
            fileName,url,outputPath
        });

        if(!rs.success) {
            console.error("다운로드 중 오류 발생:")
            console.error(" -> url:",url);
            console.error(' -> message:',rs.message);
            store.dispatch(setUrlStatus({url, status: "download-error"}));
        } else {
            if(rs.message !== fileName) {
                store.dispatch(setFileName({url, newFileName: rs.message}));
                console.log(`파일 이름 변경됨. (${fileName} --> ${rs.message})`);
            }
            
            store.dispatch(setUrlStatus({url, status: "downloaded"}))
            console.log("다운로드 완료:",url)
        }
    }

    function onClickOpenFolderButton() {
        window.electron.invoke('open-folder', outputPath)
    }

    function onClickPlayButton() {
        window.electron.invoke('play-video', {
            fileName, outputPath
        })
    }

    return (
        <div className="url-item">
            <div className="name">{fileName}</div>
            {
                status === "downloaded" &&
                <div className="downloaded">
                    <button className="open-folder-btn" onClick={onClickOpenFolderButton}>
                        <img src="img/icons/folder.png" alt="폴더 아이콘" />
                    </button>
                    <button className="play-btn" onClick={onClickPlayButton}>
                        <img src="img/icons/play.png" alt="재생 아이콘" />
                    </button>
                </div>
            }
            {
                status === "download-error" &&
                <div className="download-error">
                    <span>다운로드 오류</span>
                    <button onClick={onClickDownloadButton}>
                        <img src="img/icons/retry.png" alt="다시 다운로드 아이콘" />
                    </button>
                </div>
            }
            {
                status === "downloading" &&
                <div className="downloading">
                    다운로드 중
                </div>
            }
            {
                !status &&
                <div className="menu">
                    <button>
                        <img src="img/icons/download.png" alt="다운로드 아이콘" onClick={onClickDownloadButton}/>
                    </button>
                    <button>
                        <img src="img/icons/copy.png" alt="복사 아이콘" onClick={onClickCopyButton}/>    
                    </button>
                </div>
            }
        </div>
    )   
}

export default React.memo(UrlItem);