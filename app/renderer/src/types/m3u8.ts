export interface I_M3u8Item {
    fileName: string,
    filePath?: string,
    url: string,
    status?: string
}

export interface I_M3u8Modify {
    url: string
    fileName?: string
    filePath?: string
    status?: string
}

export type M3u8List = I_M3u8Item[];