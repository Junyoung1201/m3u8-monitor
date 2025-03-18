import { setDescription, setKeywordList, setTitle, setUrlList } from "store/info";
import { store } from "store/store";
import Strings from "strings";

function setupTest() {
    store.dispatch(setTitle("개쩌는 영상 제목 텍스트"))
    store.dispatch(setDescription("이번 영상에서는 [여행지/장소]에서의 특별한 하루를 담아보았습니다! 아름다운 풍경과 맛있는 음식, 그리고 잊지 못할 순간들을 함께 공유해요. 영상이 마음에 드셨다면 좋아요와 구독, 알림 설정까지 부탁드립니다! 다음 영상에서 또 만나요!"))
    store.dispatch(setKeywordList(["키워드","키워드","키워드","키워드","키워드","키워드","키워드","키워드","키워드","키워드","키워드",]))
    store.dispatch(setUrlList([
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트", status: Strings.STATUS_DOWNLOAD_ERROR},
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트2", status: Strings.STATUS_DOWNLOAD_FINISH },
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트3", status: Strings.STATUS_DOWNLOADING },
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트4", status: Strings.STATUS_DOWNLOAD_FINISH },
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트5"},
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트6"},
        { fileName: "영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름영상 파일 이름 영상 파일 이름 영상 파일 이름", url: "이건 영상 m3u8 url 텍스트7"},
    ]))
}


if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log("개발 환경");

    //setupTest();
}