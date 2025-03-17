import {createServer} from 'http';
import { Server } from 'socket.io';
import { sendToRenderer } from './ipc-main';

export default function startSocketServer() {
    let server = createServer();
    let io = new Server(server, {
        cors: {
            origin: ["http://localhost:*"]
        }
    })
    
    io.on('connection', socket => {
        console.log("크롬 확장 프로그램 연결됨")
        
        socket.on('hello', (data) => {
            console.log("크롬 확장 프로그램 통신 테스트:",data);
        })

        /*  정보 초기화 신호  */
        socket.on('clear-all', () => {
            console.log("정보 초기화 수신")
            sendToRenderer('clear-all');
        })

        /*  m3u8 url 목록 초기화 신호  */
        socket.on('clear-url-list', () => {
            console.log("url 목록 초기화 수신")
            sendToRenderer('clear-url-list');
        })
        
        /*  m3u8 url 발견 신호  */
        socket.on('found-m3u8', (data) => {
            console.log(`m3u8 발견 (파일 이름: ${data.fileName}, url: ${data.url})`);
            sendToRenderer("found-m3u8", data)
        })

        /*  정보 수신 신호  */
        socket.on('info', (data) => {
            console.log(`정보 수신`,data);
            sendToRenderer("info", data)
        })

    })

    return new Promise(resolve => {
        server.listen(1234, () => {
            console.log("socket 서버 시작");
            resolve(true);
        })
    })
}