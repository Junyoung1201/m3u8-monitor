import { sendNativeMessage } from "./socket-manager.js";

console.log("info util 로드")

export function getTitle() {
    let title = [...document.querySelectorAll("h1,font,div")]
                .find(el => (
                    parseInt(window.getComputedStyle(el).fontSize ?? "0px") >= 25 && 
                    el.textContent.trim().length >= 2)
                )?.textContent;

    if(title === undefined || title === undefined) {
        title = document.querySelector("title")?.textContent;
    }

    return title ?? "없음"
}

export function getKeywordList() {
    
    // '#' 문자가 3개 이상인 요소 찾기
    let element = [...document.querySelectorAll("div,font,p,div,span")].find(el => {
        let text = el.innerText?.trim();

        if(!text || text.length <= 0) {
            return false;
        }

        if(text.split("#").find(str => str.length > 7)) {
            return false;
        }
        
        return (
            [...text].find((c,i) => c === '#' && i > 2) !== undefined
        )
    })

    if(!element) {
        element = document.querySelector('meta[name="keywords"]');
        console.log('!element');
    }

    let keywords = element?.textContent?.trim()?.replaceAll(" ","")?.split("#") ?? [];

    return keywords.map(str => str.trim()).filter(str => str.length > 1);
}

export function getDescription() {
    let targetEl = [...document.querySelectorAll("div,font,p,div,span")];
    let finalDesc;

    targetEl = targetEl.filter(el => {
        let text = el.innerText?.trim();        

        if(!text || text.length <= 0) {
            return false;
        }

        // <br/><img/> 이외의 자식 요소가 있으면 거르기
        if([...el.children].find(c => !["BR",'IMG'].includes(c.tagName)) !== undefined) {
            return false;
        }

        // http나 @ 있으면 거르기
        if(text.includes("http") || text.includes("@")) {
            return false;
        }

        // # 문자가 3개 이상있으면 거르기
        let hasHastag = [...text].find((c,i) => c === '#' && i > 2) !== undefined;

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

    return finalDesc ?? "없음"
}

export async function updateInfo() {
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