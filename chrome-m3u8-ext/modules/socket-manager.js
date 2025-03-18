import "../lib/socket.io.js";
import { updateInfo } from "./info-util.js";

console.log("소켓 통신 관리 스크립트 로드")

let socket;

export function startSocket() {
    socket = io("http://localhost:1234", {
        reconnection: true,
        transports: ["websocket"]
    });
    
    socket.on('connection', () => {
        console.log("소켓 연결됨.")
    })

    socket.on('reload-info', () => {
        console.log("페이지 정보 다시 전송하기")

        updateInfo();
    })
}

export function sendNativeMessage(channel, data) {
    if(socket) {
        socket.emit(channel, data);
    }
}