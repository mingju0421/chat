<template>
    <div class="list">
        <div class="搜索区">
            <el-input placeholder="请输入内容" v-model="搜索内容" clearable>
            </el-input>
        </div>
        <div class="对话框列表"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
    @Prop() private msg!: string;
    搜索内容: string = "";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
    height: 100%;
}
.搜索区 {
    padding: 5px 15px;
}
</style>