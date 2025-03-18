import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setDescription, setKeywordList, setTitle } from "store/info";
import { RootState, store } from "store/store";
import './InfoField.css';

export default function InfoField() {

    const {title,desc,keywordList} = useSelector((state: RootState) => state.info);

    useEffect(() => {
        startIpc()
    }, []);

    function startIpc() {
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
            <div onClick={onClickTitle}>
                <div className="title">제목</div>
                <div className="content">{title}</div>
            </div>

            <div onClick={onClickKeywordList}>
                <div className="title">키워드</div>
                <div className="content" id="kw-list">
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
                <div className="content" id="description">{desc}</div>
            </div>
        </>
    )
}