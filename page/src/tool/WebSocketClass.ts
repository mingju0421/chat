class WebSocketClass {
    instance: null | WebSocketClass;
    static instance: null | WebSocketClass;
    ws: WebSocket | undefined;
    status: string | undefined;
    pingPong: string | undefined;
    pingInterval: number | undefined;
    pongInterval: number | undefined;
    url: string;
    callback: ((e: any) => void) | undefined;

    constructor(url: string, callback?: (e: any) => void) {
        this.instance = null;
        this.url = url;
        this.connect();
        this.callback = callback;
    }
    static getInstance(url: string) {
        if (!this.instance) {
            this.instance = new WebSocketClass(url);
        }
        return this.instance;
    }
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = e => {
            this.status = "open";
            console.log(`连接成功`, e);
            this.heartCheck();
            this.getMessage();
        };
    }
    /** 心跳机制 */
    heartCheck() {
        this.pingPong = "ping";
        this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === 1) {
                // 检查 ws 为链接状态 才发送
                this.ws.send(JSON.stringify(this.pingPong));
            }
        }, 10000);
        this.pongInterval = setInterval(() => {
            if (this.pingPong === "ping") {
                this.closeHandle("pingPong没有改变为pong"); // 没有返回pong 重启webSocket
            }
            // 重置为ping 若下一次 ping 发送失败 或者pong返回失败(pingPong不会改成pong)，将重启
            console.log("返回pong");
            this.pingPong = "ping";
        }, 20000);
    }
    closeHandle(e: string = "err") {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== "close") {
            console.log(`断开，重连websocket`, e);
            if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
                // 清除定时器
                clearInterval(this.pingInterval);
                clearInterval(this.pongInterval);
            }
            this.connect();
        } else {
            console.log(`websocket手动关闭,或者正在连接`);
        }
    }
    getMessage() {
        this.ws!.onmessage = e => {
            if (e.data === "pong") this.pingPong = "pong"; // 服务器端返回pong,修改pingPong的状态
            this.callback && this.callback(e);
        };
    }
    close() {
        clearInterval(this.pingInterval);
        clearInterval(this.pongInterval);
        this.status = "close";
        this.ws?.send(JSON.stringify("close"));
        this.ws?.close();
        console.log("close");
    }
    send(data: object) {
        this.ws?.send(JSON.stringify(data));
    }
}

export default WebSocketClass;
