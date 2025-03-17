interface Window {
    electron: {
        test: () => void,
        getConfig: () => Promise<any>,
        send: (channel: string, data: any) => void,
        receive: (channel: string, l: (data: any) => void) => void,
        clearIpc: () => void,
        invoke: (channel: string, data: any) => Promise<any>
    }
}