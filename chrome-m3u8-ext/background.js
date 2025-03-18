import { sendNativeMessage, startSocket } from "./modules/socket-manager.js";
import { Strings } from "./modules/str.js";
import { updateInfo } from "./modules/info-util.js";

function getFileNameByUrl(url) {
    let cIndex = url.indexOf(".m3u8")-1;
    let fileNameChar = [];

    while(!['/','?'].includes(url[cIndex])) {
        fileNameChar.push(url[cIndex--]);
    }

    return fileNameChar.reverse().join("")+".m3u8";
}

startSocket();

/*  socket.io 통신 지속을 위한 wake-up 이벤트 처리  */
chrome.runtime.onStartup.addListener(() => {
    startSocket();
});

/*  네트워크 교환이 모두 완료된 시점에서 m3u8 감지  */

chrome.webRequest.onCompleted.addListener(
    ({url,responseHeaders}) => {
        if (url.includes('.m3u8')) {

            // 'http' 글자가 2개 이상 없는경우만
            if(url.split('http').length <= 2) {
                let fileName = getFileNameByUrl(url);
                
                sendNativeMessage(Strings.NATIVE_CH_FOUND_M3U8, { fileName, url });
            }
        }
    },
    { urls: ["<all_urls>"] }
);

function onPageChanged() {
    sendNativeMessage(Strings.NATIVE_CH_CLEAR_URL_LIST);
    updateInfo();
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
        onPageChanged()
    }
});

chrome.tabs.onRemoved.addListener(() => {
    onPageChanged
});