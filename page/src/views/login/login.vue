<template>
    <div class="login">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
                <el-input v-model.number="ruleForm.name"> </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off">
                </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">
                    提交
                </el-button>
                <el-button @click="resetForm('ruleForm')">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface FormObj {
    pass: string;
    checkPass: string;
    name: string;
}
interface Rule {
    validator: Validate
    trigger: string
}
interface Rules {
    pass: Rule[]
    checkPass: Rule[]
    name: Rule[]
}
interface Validate {
    (rule: any, value: string, callback: (err?: Error) => any): any
}


@Component
export default class Login extends Vue {
    validateName: Validate = (rule: any, value: string, callback: (err?: Error) => any) => {
        if (!value) {
            return callback(new Error("用户名不能为空"));
        }
        callback();
    }
    validatePass: Validate = (rule: any, value: string, callback: (err?: Error) => any) => {
        if (!value) return callback(new Error("请输入密码"));
        else {
            if (this.ruleForm.checkPass)
                (this.$refs.ruleForm as HTMLFormElement).validateField("checkPass");
            callback();
        }
    }
    validatePass2: Validate = (rule: any, value: string, callback: (err?: Error) => any) => {
        if (!value) return callback(new Error("请再次输入密码"));
        else if (value !== this.ruleForm.pass)
            callback(new Error("两次输入密码不一致"));
        else callback();
    }
    ruleForm: FormObj = {
        pass: "",
        checkPass: "",
        name: ""
    };
    rules: Rules = {
        pass: [{ validator: this.validateName, trigger: 'blur' }],
        checkPass: [{ validator: this.validatePass2, trigger: 'blur' }],
        name: [{ validator: this.validateName, trigger: 'blur' }]
    }
    submitForm(formName: string) {
        (this.$refs[formName] as HTMLFormElement).validate(valid => {
            if (valid) alert('submit')
            else return false
        })
    }
    resetForm(formName: string) {
        (this.$refs[formName] as HTMLFormElement).resetFields();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
