<template>
  <div class="对话框">
    <header class="头部">
      <span>
        {{title}}
        <span v-if="numberOfPeople">({{numberOfPeople}})</span>
      </span>
      <i class="el-icon-user"></i>
    </header>
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
  title: string = "聊天室名称"; // 聊天室名称
  numberOfPeople: string = "1";
  ws: null | WebSocketClass = null;
  mounted() {
    this.wsInit();
  }
  a(data: any) {
    console.log(data.type);
  }
  wsInit() {
    this.ws = new WebSocketClass("ws:localhost:3000", this.a);
  }
  sendMsg() {
    console.log("发送信息");
    this.ws!.send({
      type: "send",
      id: "123",
      msg: {
        message: this.inputValue,

        avatar:
          "https://tva1.sinaimg.cn/large/007S8ZIlly1gen70l163oj30bu0c4dnf.jpg"
      }
    });
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
  border-top: 1px solid #ccc;
}
.输入栏 >>> .el-input__inner {
  border: none;
}
.el-button {
  border-radius: 20px;
}
.显示区域 {
  height: calc(100% - 121px);
}
.头部 {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
</style>