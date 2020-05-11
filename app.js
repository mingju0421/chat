const Koa = require("koa");
const Router = require("koa-router");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser"); // 读取 post 请求参数
const views = require("koa-views"); // 用来加载 html 模本文件
const WebSocket = require("koa-websocket");

const app = WebSocket(new Koa());
const router = new Router(); // 初始化路由

let conversationList = []; // 保存上线
let Conversation = ctx => {
    let Conversation = {};
    Conversation.ctx = ctx;
    Conversation.name = "";
    return Conversation;
};

app.use(bodyParser({ enableTypes: ["json", "form", "text"] })); // 使用中间件
app.use(require("koa-static")(__dirname + "/public")); // 加载静态资源
app.use(views(__dirname + "/views", { extension: "pug" }));
app.use(router.routes()); // 加载 router 中间件
app.use(router.allowedMethods()); //对异常码处理

app.ws.use((ctx, next) => {
    /*将连接信息存入到数据库中，包括用户名，连接id，时间，消息类型,消息内容*/
    conversationList.push(Conversation(ctx));
    let message = null;
    ctx.websocket.on("message", opt => {
        message = JSON.parse(opt);
        if (message.type === "ping") {
            let msg = { type: "pong" };
            ctx.websocket.send(JSON.stringify(msg));
        } else {
            console.log(message);
            let msg = {
                type: "send",
                id: "463",
                msg: {
                    message: "你好啊",
                    avatar: "https://tva1.sinaimg.cn/large/007S8ZIlly1gen70l163oj30bu0c4dnf.jpg"
                }
            };
            ctx.websocket.send(opt);
            ctx.websocket.send(JSON.stringify(msg));
        }

        // message = JSON.parse(opt);
        // console.log(message, "~~~~~~~~~");
        // if (message.type == "goOnline") {
        //     conversationList.forEach((conversation, index, conversationList) => {
        //         if (conversation.ctx.websocket._ultron.id == ctx.websocket._ultron.id) {
        //             conversation.name = message.name;
        //         }
        //     });
        // }
    });
    ctx.websocket.on("close", opt => {
        for (let i = 0; i < conversationList.length; i++) {
            if (conversationList[i].ctx.websocket.readyState == 2 || conversationList[i].ctx.websocket.readyState == 3) {
                outName = conversationList[i].name;
                conversationList.splice(i, 1);
                i--;
            }
        }
        let _opt = JSON.stringify({
            name: outName,
            type: "goOutline",
            time: new Date().toLocaleString()
        });
        ctx.websocket.send(_opt);
    });
});

// app.use(json());

router.post("/test", async (ctx, next) => {
    let retunData = ctx.request.body;
    console.log(ctx.request.body);
    ctx.body = retunData;
});
router.get("/", async (ctx, next) => {
    ctx.render("index");
});
app.listen(3000);
