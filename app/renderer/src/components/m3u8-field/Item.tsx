import React, { useState } from "react";
import { useSelector } from "react-redux";
import { setFileName, updateM3u8 } from "store/info";
import { RootState, store } from "store/store";
import { I_M3u8Item } from "types/m3u8";
import Strings from 'strings';
import './Item.css';
import { downloadVideo } from "modules/download";
import { getConfig } from "modules/config";

function Item(urlItem: I_M3u8Item) {

    const {fileName,url,status,filePath} = urlItem

    function onClickCopyButton() {
        navigator.clipboard.writeText(url)
    }

    async function onClickDownloadButton() {
        let {videoOutputPath} = getConfig();

        console.log("다운로드 시작:",url,videoOutputPath)
        downloadVideo(urlItem, videoOutputPath);
    }

    async function onClickOpenFolderButton() {
        let folderPath = filePath!.slice(0,filePath!.lastIndexOf("\\"));

        console.log("폴더 열기:",folderPath);

        let rs = await window.electron.invoke('open',folderPath);

        if(!rs.success) {
            alert(rs.message);
        }
    }

    async function onClickPlayButton() {
        let rs = await window.electron.invoke('open', filePath!)

        if(!rs.success) {
            alert(rs.message);
        }
    }

    return (
        <div className="m3u8-item" data-status={status}>
            <div className="name">{fileName}</div>
            {
                status === Strings.STATUS_DOWNLOAD_FINISH &&
                <div className="menu">
                    <button className="play-btn" onClick={onClickPlayButton}>
                        <img src="img/icons/play.png" alt="재생 아이콘" />
                    </button>
                    <button className="open-folder-btn" onClick={onClickOpenFolderButton}>
                        <img src="img/icons/folder.png" alt="폴더 아이콘" />
                    </button>
                </div>
            }
            {
                status === Strings.STATUS_DOWNLOAD_ERROR &&
                <div className="retry">
                    <span>{Strings.TEXT_DOWNLOAD_ERROR}</span>
                    <button onClick={onClickDownloadButton}>
                        <img src="img/icons/retry.png" alt="다시 다운로드 아이콘" />
                    </button>
                </div>
            }
            {
                status === Strings.STATUS_DOWNLOADING &&
                <div className="dl-text">
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

export default React.memo(Item);