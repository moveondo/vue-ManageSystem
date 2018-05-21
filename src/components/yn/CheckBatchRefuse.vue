<template>
    <div class="table">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="批量提交标的" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" ></el-input>
        </el-form-item>
      
        <el-form-item>
         <el-button type="primary" @click="submitForm('ruleForm')">批量拒绝</el-button>
         <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <div class="mess">Tips:标的信息请以<b>逗号</b>隔开</div>

</el-form>
         <verifyPermission></verifyPermission>
    </div>
</template>

<script>
    import verifyPermission from './Permission.vue';
    export default {
        data() {
            return {
                //url:"http://172.20.14.33:8086/backend/IListingService/batchRefuseListingAuditInfo",
                url:"/backend/IListingService/batchRefuseListingAuditInfo",
                  ruleForm: {
                    desc: ''
                  },
                   rules: {
                        desc: [
                            { required: true, message: '请填写标的信息(以逗号隔开)', trigger: 'blur' }
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
            self.$axios.post(self.url, {"listIdCollection":Desc,"auditStatus":0}).then((res) => {

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
    margin-left: 150px;
}

</style>
