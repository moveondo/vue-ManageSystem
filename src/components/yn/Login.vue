<template>
    <div class="login-wrap">
        <div class="ms-title">印尼项目后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="phone"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录(Masuk)</el-button>
                </div>
                <!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填11。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                url:"/backend/ILoginService/login",
                //url:"//172.20.14.33:8080/backend/ILoginService/login",
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入手机号码(Mohon masukan nomor handphone)', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码(Mohon masukan sandi)', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                let mobile=self.ruleForm.username;
                let password=self.ruleForm.password;
                let FunctionUrl=Array();
                // var tF=self.checkMobile(mobile);
                // if(tF===false){
                //     return false;
                // }
                self.$axios.post(self.url, {"mobile":mobile,"password":password,}).then((res) => {
                    if(res.data.result==0 ){
                        let ms_username=res.data.content.user.username;
                        let ms_mobile = res.data.content.user.mobile;
                        localStorage.setItem('ms_username',ms_username);
                        localStorage.setItem('ms_mobile', ms_mobile);
                        

                         var Length=res.data.content.functionList.length;
                         for(let i=0;i<Length;i++){
                            FunctionUrl.push(res.data.content.functionList[i].functionUrl);
                         }

                          localStorage.setItem('ChangeFunction',FunctionUrl);
                          this.$store.commit('ChangeFunction', FunctionUrl);

                         self.$router.push('/readme');
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }

                }).catch(function(err){
                console.log("调用失败",err)
                })


            },
            checkMobile(mobile){

                if(!(/^\d{1,11}$/.test(mobile)) && mobile.length>="1"){
                    this.ruleForm.username="";
                    this.ruleForm.password="";
                     this.$message.error('手机号码有误！');
                    return false;
                }
                if((/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile)) && mobile.length<"11"){
                     this.ruleForm.username="";
                     this.ruleForm.password="";
                     this.$message.error('手机号码有误！');
                    return false;
                }
                if((/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile)) && mobile.length=="11"){

                      return true;
                }else{
                     this.ruleForm.username="";
                    this.ruleForm.password="";
                     this.$message.error('手机号码有误！');
                      return false;
                }

            }

        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
