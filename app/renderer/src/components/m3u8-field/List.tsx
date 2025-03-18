import { useSelector } from "react-redux"
import { RootState } from "store/store";
import './List.css';
import Item from "./Item";

export default function List() {

    const {m3u8List} = useSelector((state: RootState) => state.info);

    return (
        <div id="m3u8-list">
            {
                m3u8List.map(({fileName,url,status,filePath},i)=> (
                    <Item fileName={fileName} url={url} key={`m3u8_item_${i}`} status={status} filePath={filePath} />
                ))
            }
        </div>
    )
}