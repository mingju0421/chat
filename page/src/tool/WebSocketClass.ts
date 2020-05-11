interface Heartbeat {
    type: string;
}
interface HeartObj {
    timeout: number;
    timeoutObj: number | undefined;
    serverTimeoutObj: number | undefined;
    reset: () => HeartObj;
    start: () => void;
}

class WebSocketClass {
    ws: WebSocket | undefined;
    status: string | undefined;
    pingPong: Heartbeat = { type: "ping" };
    url: string;
    callback: ((e: any) => void) | undefined;
    flag: boolean = false;
    tt: number | undefined;

    constructor(url: string, callback?: (e: any) => void) {
        this.url = url;
        this.connect();
        this.callback = callback;
    }
    getInstance(url: string) {
        if (!this.ws) {
            this.ws = new WebSocket(url);
        }
        return this.ws;
    }
    reconnect() {
        if (this.flag) return;
        this.flag = true;
        this.tt && clearTimeout(this.tt);
        this.tt = setTimeout(() => {
            this.connect();
            this.flag = false;
        }, 4000);
    }
    connect() {
        this.status = "open";
        this.ws = new WebSocket(this.url);
        this.ws.onopen = e => {
            console.log(`连接成功`, e);
            this.getMessage();
            this.heartCheck.reset().start();
        };
        this.ws!.onerror = e => {
            this.closeHandle("onerror");
            console.log(e);
        };
        this.ws!.onclose = () => {
            this.heartCheck.reset();
            this.closeHandle("onclose");
            console.log("close");
        };
    }
    /** 心跳机制 */
    heartCheck: HeartObj = {
        timeout: 3000, // 每隔三秒发送心跳
        timeoutObj: undefined,
        serverTimeoutObj: undefined,
        reset: () => {
            this.heartCheck.timeoutObj && clearTimeout(this.heartCheck.timeoutObj);
            this.heartCheck.serverTimeoutObj && clearTimeout(this.heartCheck.serverTimeoutObj);
            return this.heartCheck;
        },
        start: () => {
            this.heartCheck.timeoutObj = setTimeout(() => {
                this.send(this.pingPong);
                this.heartCheck.serverTimeoutObj = setTimeout(() => {
                    this.closeHandle("未返回心跳");
                }, this.heartCheck.timeout * 3);
            }, this.heartCheck.timeout);
        }
    };
    closeHandle(e: string = "err") {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== "close") {
            console.log(`断开，重连websocket`, e);
            setTimeout(() => {
                this.close();
                this.reconnect();
            }, 3000);
        } else {
            console.log(`websocket手动关闭,或者正在连接`);
        }
    }
    getMessage() {
        this.ws!.onmessage = e => {
            this.heartCheck.reset().start();
            const data = JSON.parse(e.data);
            console.log(data);
            this.callback && this.callback(data);
        };
    }
    close() {
        this.heartCheck.reset();
        this.status = "close";
        this.ws?.send(JSON.stringify("close"));
        this.ws?.close();
        this.ws = undefined;
        console.log("close");
    }
    send(data: object) {
        this.ws?.send(JSON.stringify(data));
    }
}

export default WebSocketClass;
