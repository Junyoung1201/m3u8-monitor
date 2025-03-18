import {createServer} from 'http';
import { Server } from 'socket.io';
import CommuManager from './comu';

export let io: Server;

export default function startSocketServer() {
    let server = createServer();
    io = new Server(server, {
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
            CommuManager.sendToRenderer('clear-all');
        })

        /*  m3u8 url 목록 초기화 신호  */
        socket.on('clear-url-list', () => {
            CommuManager.sendToRenderer('clear-url-list');
        })
        
        /*  m3u8 url 발견 신호  */
        socket.on('found-m3u8', (data) => {
            CommuManager.sendToRenderer("found-m3u8", data)
        })

        /*  정보 수신 신호  */
        socket.on('info', (data) => {
            CommuManager.sendToRenderer("info", data)
        })

    })

    return new Promise(resolve => {
        server.listen(1234, () => {
            console.log("socket 서버 시작");
            resolve(true);
        })
    })
}