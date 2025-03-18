export default class Logger {
    private prefix: string;

    constructor(prefix: string = "UNNAMED") {
        this.prefix = prefix;
    }

    private getPrefix(): string {
        return `[${Logger.getDateString()}] [${this.prefix}]`;
    }

    private _log(type: "log" | "warn" | "error", message: string, data?: any) {
        console[type](`${this.getPrefix()} ${message}`, data ?? '');
    }

    log(message: string, data?: any) {
        this._log("log", message, data);
    }

    warn(message: string, data?: any) {
        this._log("warn", message, data);
    }

    error(message: string, data?: any) {
        this._log("error", message, data);
    }

    private static getDateString(): string {
        const now = new Date();
        return now.toISOString().replace("T", " ").split(".")[0];
    }
}
