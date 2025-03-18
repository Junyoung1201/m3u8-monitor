import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Strings from "strings";
import { I_M3u8Item, I_M3u8Modify, M3u8List } from "types/m3u8";

interface init {
    title: string,
    keywordList: string[],
    desc: string,
    m3u8List: M3u8List
}

export const initialState: init = {
    title: "없음",
    keywordList: [],
    desc: "없음",
    m3u8List: []
}

export const infoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        clear(state) {
            state.title = "없음";
            state.desc = "없음";
            state.m3u8List = [];
            state.keywordList = [];
            console.clear();
            console.log("정보 초기화")
        },

        setTitle(state, action) {
            state.title = action.payload;
        },

        setKeywordList(state, action) {
            state.keywordList = action.payload
        },

        setDescription(state, action) {
            state.desc = action.payload;
        },

        setUrlList(state, action) {
            state.m3u8List = action.payload
        },

        addM3u8(state, action) {
            if(state.m3u8List.find(i => i.url === action.payload.url) === undefined) {
                state.m3u8List.push(action.payload)
            }
        },

        clearUrlList(state) {
            state.m3u8List = state.m3u8List.filter(url => url.status === Strings.STATUS_DOWNLOADING);
        },

        updateM3u8(state: typeof initialState, {payload}: PayloadAction<I_M3u8Modify>) {
            let m3u8 = state.m3u8List.find(m => m.url === payload.url);

            if(m3u8) {
                Object.assign(m3u8, payload)
            }
        },

        setFileName(state, {payload}: PayloadAction<{url:string, newFileName: string}>) {
            let target = state.m3u8List.find(({url}) => url === payload.url)

            if(target) {
                target.fileName = payload.newFileName;
            }
        }
    }
})

export const {setFileName,updateM3u8,clearUrlList, addM3u8,clear:clearInfo,setUrlList,setDescription,setKeywordList,setTitle} = infoSlice.actions;