import { useEffect } from "react";
import { store } from "store/store";
import './App.css';
import { clearInfo } from "store/info";
import ConfigField from "components/config-field/ConfigField";
import InfoField from "components/info-field/InfoField";
import M3U8Field from "components/m3u8-field/M3U8Field";
import MenuField from "components/menu-field/MenuField";

export default function App() {
    useEffect(() => {
        startIpc();

        return () => {
            clearIpc();
        }
    },[])

    function clearIpc() {
        // 모든 ipc 통신 종료
        window.electron.clearIpc();
    }

    async function startIpc() {

        /*  모든 정보 초기화 신호 수신  */
        window.electron.receive('clear-all', () => {
            store.dispatch(clearInfo());
        })
    }

    return (
        <>
            <section>
                <InfoField />
                <M3U8Field />
                <MenuField />
                <ConfigField />
            </section>
        </>
    )
}