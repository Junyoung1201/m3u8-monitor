import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UrlList } from "types/url";

interface init {
    title: string,
    keywordList: string[],
    desc: string,
    urlList: UrlList,
    videoOutputPath: string
}

export const initialState: init = {
    title: "없음",
    keywordList: [],
    videoOutputPath: "A:\\Elurim\\Videos",
    desc: "없음",
    urlList: []
}

export const infoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        clear(state) {
            state.title = "없음";
            state.desc = "없음";
            state.urlList = [];
            state.keywordList = [];
            console.clear();
            console.log("정보 초기화")
        },

        setTitle(state, action) {
            state.title = action.payload;
        },

        setVideoOutputPath(state, action) {
            state.videoOutputPath = action.payload
        },

        setKeywordList(state, action) {
            state.keywordList = action.payload
        },

        setDescription(state, action) {
            state.desc = action.payload;
        },

        setUrlList(state, action) {
            state.urlList = action.payload
        },

        addUrl(state, action) {
            if(state.urlList.find(i => i.url === action.payload.url) === undefined) {
                state.urlList.push(action.payload)
            }
        },

        clearUrlList(state) {
            state.urlList = state.urlList.filter(url => url.status === "downloading");
        },

        setUrlStatus(state, {payload}: PayloadAction<{url: string, status: string}>) {
            let target = state.urlList.find(({url}) => url === payload.url)

            if(target) {
                target.status = payload.status;
            }
        },

        setFileName(state, {payload}: PayloadAction<{url:string, newFileName: string}>) {
            let target = state.urlList.find(({url}) => url === payload.url)

            if(target) {
                target.fileName = payload.newFileName;
            }
        }
    }
})

export const {setFileName,setVideoOutputPath,setUrlStatus,clearUrlList, addUrl,clear:clearInfo,setUrlList,setDescription,setKeywordList,setTitle} = infoSlice.actions;