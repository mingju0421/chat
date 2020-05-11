<template>
  <div class="对话框">
    <header class="头部">
      <span>
        {{title}}
        <span v-if="numberOfPeople">({{numberOfPeople}})</span>
      </span>
      <i class="el-icon-user"></i>
    </header>
    <div class="显示区域">
      <div v-for="(item, index) in msgList" :key="index" class="msgItem">
        <div class="other" v-if="item.id !== id">
          <img :src="item.msg.avatar" alt="" class="avatar">
          <div>
            <div class="userName">{{item.id}}</div>
            <el-card class="box-card">
              {{item.msg.message}}
            </el-card>
          </div>
        </div>
        <div class="me" v-else>
          <img :src="item.msg.avatar" alt="" class="avatar">
          <div>
            <div class="userName">{{item.id}}</div>
            <el-card class="box-card">
              {{item.msg.message}}
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div class="输入栏">
      <el-input v-model="inputValue" @change="sendMsg" placeholder="请输入内容"></el-input>
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
  msgList: object[] = [];
  id: string = "123";
  mounted() {
    this.wsInit();
  }
  a(data: any) {
    console.log(data.type);
    this.msgList.push(data);
  }
  wsInit() {
    this.ws = new WebSocketClass("ws:localhost:3000", this.a);
  }
  sendMsg() {
    console.log("发送信息");
    this.ws!.send({
      type: "send",
      id: this.id,
      msg: {
        message: this.inputValue,
        avatar:
          "https://tva1.sinaimg.cn/large/007S8ZIlly1gen70l163oj30bu0c4dnf.jpg"
      }
    });
    this.inputValue = "";
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
  overflow: auto;
}
.头部 {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin: 10px;
}
.other {
  display: flex;
}
.me {
  display: flex;
  flex-direction: row-reverse;
}
.me .userName {
  text-align: right;
}

.userName {
  color: #999;
}
.box-card >>> .el-card__body {
  padding: 5px 10px;
}
</style>