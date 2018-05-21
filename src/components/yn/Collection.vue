<template>
    <div class="table">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="300px" class="demo-ruleForm">
        <el-form-item label="催收owner分配(Desakan owner terpisah)" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" ></el-input>
        </el-form-item>
      
        <el-form-item>
         <el-button type="primary" @click="submitForm('ruleForm')">提交(Kirim)</el-button>
         <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <div class="mess">Tips:如878899/linyueqing,8878878/linyueqing</div>

</el-form>
         <verifyPermission></verifyPermission>
    </div>
</template>

<script>
    import verifyPermission from '../project/Permission.vue';
    export default {
        data() {
            return {
               // url:"//pengfei.ppdai.com:9080/backend/ICollBackendService/allocateOwner",
                url:"/backend/ICollBackendService/allocateOwner",
                  ruleForm: {
                    desc: ''
                  },
                   rules: {
                        desc: [
                            { required: true, message: '请填写催收owner分配(Desakan owner terpisah)', trigger: 'blur' }
                        ]
                   }
            
            }
        },
        components: {
            'verifyPermission':verifyPermission,
        },
 
        methods: {
        queryData(){
            let self = this;
           let Desc=self.ruleForm.desc;
            self.$axios.post(self.url, {"allocateOwnerList":Desc}).then((res) => {

                if(res.data.result==0){

                self.$message.success("提交成功");
                self.ruleForm.desc="";

                }else if( res.data.result=='-99' || res.data.result=='-999'){
                        self.$message.error(res.data.resultMessage);
                }else{
                    self.$message.error(res.data.resultMessage);
                }
                                      

            })
        },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            console.log(valid);
            
          if (valid) {
           this.queryData();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
        
   }
}
</script>

<style scoped>
.mess{  
    vertical-align: middle; 
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
    margin-left: 300px;
}
.el-textarea{
    width: 500px;
}
.el-form-item__label{
    width: 300px;
}

</style>
