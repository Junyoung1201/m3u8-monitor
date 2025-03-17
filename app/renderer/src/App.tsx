import UrlList from "components/UrlList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "store/store";
import './App.css';
import { addUrl, clearInfo, clearUrlList, setDescription, setKeywordList, setTitle, setUrlList, setVideoOutputPath } from "store/info";

export default function App() {
    const {title,desc,keywordList,videoOutputPath} = useSelector((state: RootState) => state.info);
    const [settings,setSettings] = useState<boolean>(false);

    useEffect(() => {
        loadConfig();
        startIpc();

        return () => {
            stopIpc();
        }
    },[])

    function stopIpc() {
        window.electron.clearIpc();
    }

    async function startIpc() {

        /*  정보 초기화 신호 수신  */
        window.electron.receive('clear-all', () => {
            store.dispatch(clearInfo());
        })

        /*  url 목록 초기화 신호 수신  */
        window.electron.receive('clear-url-list', () => {
            store.dispatch(clearUrlList());
        })

        /*  m3u8 url 발견  */
        window.electron.receive("found-m3u8", (data) => {
            console.log("m3u8 발견",data);
            store.dispatch(addUrl(data))
        })

        /*  제목, 설명, 키워드 목록 수신  */
        window.electron.receive("info", (data) => {
            if(data) {
                console.log(`정보 수신:`)
                console.log(" -> 제목:",data.title);
                console.log(" -> 키워드:",data.keywords);
                console.log(" -> 설명:",data.desc);

                store.dispatch(setTitle(data.title));
                store.dispatch(setDescription(data.desc));
                store.dispatch(setKeywordList(data.keywords));
            }
        })
    }

    async function loadConfig() {
        let {videoDownloadPath:str} = await window.electron.getConfig();

        store.dispatch(setVideoOutputPath(str))

        console.log("설정 불러옴.")
    }

    function onClickKeywordList() {
        navigator.clipboard.writeText(keywordList.join(", "));
    }

    function onClickTitle() {
        navigator.clipboard.writeText(title);
    }

    function onClickDescription() {
        navigator.clipboard.writeText(desc);
    }

    return (
        <>
            <section>
                <div onClick={onClickTitle}>
                    <div className="title">제목</div>
                    <div className="content">{title}</div>
                </div>

                <div onClick={onClickKeywordList}>
                    <div className="title">키워드</div>
                    <div className="content kw-list">
                        {
                            keywordList.length > 0 &&
                            keywordList.map((str,i) => (
                                <div className="kw-item" key={`kw_item_${i}`}>
                                    {str}
                                </div>
                            ))
                        }
                        {
                            keywordList.length === 0 &&
                            <div>없음</div>
                        }
                    </div>
                </div>

                <div onClick={onClickDescription}>
                    <div className="title">설명</div>
                    <div className="content desc">{desc}</div>
                </div>

                <div data-no-clickable>
                    <div className="title">감지된 m3u8</div>
                    <div className="content url-list-holder">
                        <UrlList />
                    </div>
                </div>

                <div data-no-clickable>
                    <div className="title">메뉴</div>
                    <div className="footer-menu">
                        <button>영상 전체 다운로드</button>
                        <button>정보 새로고침</button>
                        <button>정보 전체 복사</button>
                    </div>
                </div>

                <div data-no-clickable>
                    <div className="title">영상 다운로드 경로</div>
                    <div className="content settings">
                        <input type="text" placeholder="영상 다운로드 경로를 입력해주세요." defaultValue={videoOutputPath} />
                    </div>
                </div>
            </section>
        </>
    )
}