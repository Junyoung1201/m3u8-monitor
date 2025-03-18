import { store } from "store/store";
import List from "./List";
import { addM3u8, clearUrlList } from "store/info";
import { useEffect } from "react";

export default function M3U8Field() {

    useEffect(() => {
        startIpc();
    },[]);

    function startIpc() {

        /*  url 목록 초기화 신호 수신  */
        window.electron.receive('clear-url-list', () => {
            store.dispatch(clearUrlList());
        })
    
        /*  m3u8 url 발견  */
        window.electron.receive("found-m3u8", (data) => {
            console.log("m3u8 발견",data);
            store.dispatch(addM3u8(data))
        })
        
    }

    return (
        <div data-no-clickable>
            <div className="title">감지된 m3u8</div>
            <div className="content url-list-holder">
                <List />
            </div>
        </div>
    )
}