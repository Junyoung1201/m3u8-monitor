import { useSelector } from "react-redux"
import { RootState } from "store/store";
import './UrlList.css';
import UrlItem from "./UrlItem";

export default function UrlList() {

    const {urlList} = useSelector((state: RootState) => state.info);

    return (
        <div className="url-list">
            {
                urlList.map(({fileName,url,status},i)=> (
                    <UrlItem fileName={fileName} url={url} key={`url_item_${i}`} status={status} />
                ))
            }
        </div>
    )
}