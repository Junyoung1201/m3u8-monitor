import { useSelector } from 'react-redux';
import './MenuField.css';
import { RootState, store } from 'store/store';
import { downloadVideo } from 'modules/download';
import { getConfig } from 'modules/config';

export default function MenuField() {

    const {title,desc,keywordList, m3u8List: urlList} = useSelector((state: RootState) => state.info);

    async function onClickInfoReloadButton() {
        window.electron.send('reload-info', undefined)
    }

    function onClickDownloadAllButton() {

        let {videoOutputPath} = getConfig();

        for(let i of urlList) {
            downloadVideo(i, videoOutputPath);
        }
    }

    function onClickCopyInfoAllButton() {
        let text = (
            `[${title}]\n\n`+
            `${desc}\n\n`+
            '--\n\n'
        )

        navigator.clipboard.writeText(text);
    }

    return (
        <div data-no-clickable>
            <div className="title">메뉴</div>
            <div className="footer-menu">
                <button onClick={onClickDownloadAllButton}>
                    영상 전체 다운로드
                </button>

                <button onClick={onClickInfoReloadButton}>
                    정보 새로고침
                </button>

                <button onClick={onClickCopyInfoAllButton}>
                    정보 전체 복사
                </button>
            </div>
        </div>
    )
}