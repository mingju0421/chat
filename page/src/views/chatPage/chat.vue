<template>
    <div class="对话框">
        <div class="显示区域">Main</div>
        <div class="输入栏">
            <el-input v-model="inputValue" placeholder="请输入内容"></el-input>
            <el-button plain @click="sendMsg">Send</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import WebSocketClass from "../../tool/WebSocketClass";

@Component
export default class HelloWorld extends Vue {
    @Prop() private msg!: string;
    inputValue: string = "";
    ws: null | WebSocketClass = null;
    mounted() {
        this.ws = new WebSocketClass("ws:localhost:3000", this.a);
    }
    a(s: any) {
        console.log(`a~~~~${s}`);
    }
    sendMsg() {
        console.log("发送信息");
        this.ws!.send({ type: "say", msg: this.inputValue });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.对话框 {
    height: 100%;
}
.输入栏 {
    display: flex;
    padding: 10px 15px;
}
.输入栏 >>> .el-input__inner {
    border: none;
}
.el-button {
    border-radius: 20px;
}
.显示区域 {
    height: calc(100% - 60px);
}
</style>