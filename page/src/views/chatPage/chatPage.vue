<template>
    <el-row class="chatPage">
        <el-col :span="6">
            <List />
        </el-col>
        <el-col :span="18">
            <Chat />
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
const List = () => import(/* webpackChunkName: "聊天室列表" */ "./list.vue");
const Chat = () => import(/* webpackChunkName: "聊天室" */ "./chat.vue");
@Component({
    components: { List, Chat }
})
export default class HelloWorld extends Vue {
    @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chatPage {
    height: 100%;
}
.el-col {
    height: 100%;
}
</style>