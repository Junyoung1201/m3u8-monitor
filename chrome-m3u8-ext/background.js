
import "./socket.io.js";

let socket;

function startSocket() {
    socket = io("http://localhost:1234", {
        reconnection: true,
        transports: ["websocket"]
    });
    
    socket.on('connection', () => {
        console.log("소켓 연결됨.")
    })
}

function sendNativeMessage(channel, data) {
    if(socket) {
        socket.emit(channel, data);
    }
}

function getFileNameByUrl(url) {
    let cIndex = url.indexOf(".m3u8")-1;
    let fileNameChar = [];

    while(!['/','?'].includes(url[cIndex])) {
        fileNameChar.push(url[cIndex--]);
    }

    return fileNameChar.reverse().join("")+".m3u8";
}

async function updateInfo() {
    let [currentTab] = await chrome.tabs.query({
        active: true, lastFocusedWindow: true
    })

    const executeScript = (callback) => {
        return new Promise(resolve => {
            chrome.scripting.executeScript({
                target: {
                    tabId: currentTab.id
                },
                func: callback
            }).then(([{result}]) => {
                resolve(result);
            })
        })
    }

    let title, desc, keywords;

    if(currentTab !== undefined && currentTab !== null) {

        title = await executeScript(getTitle);
        desc = await executeScript(getDescription);
        keywords = await executeScript(getKeywordList);

    }

    sendNativeMessage('info', {
        title: title ?? "없음",
        desc: desc ?? "없음",
        keywords: keywords ?? []
    });

    console.log("정보 업데이트")
}

function getTitle() {
    let title = [...document.querySelectorAll("h1,font,div")]
                .find(el => (
                    el.className.includes("title") && 
                    el.textContent.trim().length > 0)
                )?.textContent;

    if(title === undefined || title === undefined) {
        title = document.querySelector("title")?.textContent;
    }

    return title ?? "없음"
}

function getKeywordList() {
    
    // '#' 문자가 3개 이상인 요소 찾기
    let element = [...document.querySelectorAll("div,font,p,div,span")].find(el => {
        let text = el.innerText?.trim();

        if(!text || text.length <= 0) {
            return false;
        }

        return (
            [...text].find((c,i) => c === '#' && i > 2) !== undefined
        )
    })

    if(!element) {
        element = document.querySelector('meta[name="keywords"]');
    }

    return element?.textContent?.trim()?.replaceAll(" ","")?.split("#") ?? []
}

function getDescription() {
    let targetEl = [...document.querySelectorAll("div,font,p,div,span")];
    let finalDesc;

    targetEl = targetEl.filter(el => {
        let text = el.innerText?.trim();        

        if(!text || text.length <= 0) {
            return false;
        }

        // 자식 요소가 있으면 거르기
        if(el.children.length > 0) {
            return false;
        }

        // http나 @ 있으면 거르기
        if(text.includes("http") || text.includes("@")) {
            return false;
        }

        // # 문자가 3개 이상있으면 거르기
        let hasHastag = [...str].find((c,i) => c === '#' && i > 2) !== undefined;

        if(hasHastag) {
            return false;
        }

        return true;
    })

    // 만약 설명 요소 후보가 2개 이상이면 가장 긴 텍스트를 선택하기
    if(targetEl.length > 1) {
        let max = 0;
        let result;

        for(let el of targetEl) {
            if(max <= el.textContent.length) {
                max = el.textContent.length;
                result = el;
            }
        }

        finalDesc = result.textContent;

    } else {

        // 후보 요소가 아예 없으면 meta description 가져오기
        if(targetEl.length === 0) {
            finalDesc = document.querySelector('meta[name="description"]')?.textContent
        } else {
            finalDesc = targetEl[0]?.textContent
        }
    }

    return desc ?? "없음"
}

startSocket();

/*  socket.io 통신 지속을 위한 wake-up 이벤트 처리  */
chrome.runtime.onStartup.addListener(() => {
    startSocket();
});

/*  네트워크 교환이 모두 완료된 시점에서 m3u8 감지  */

chrome.webRequest.onCompleted.addListener(
    ({url}) => {
        if (url.includes('.m3u8')) {
            let fileName = getFileNameByUrl(url);

            sendNativeMessage('found-m3u8', { fileName, url });
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
        sendNativeMessage('clear-url-list');
        updateInfo();
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    sendNativeMessage('clear-url-list');
    updateInfo();
});