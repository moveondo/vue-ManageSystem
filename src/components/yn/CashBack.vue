<template>
    <div>
        <verifyPermission></verifyPermission>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 资金</el-breadcrumb-item>
                <el-breadcrumb-item>资金回滚</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标的id">
                    <el-input v-model="form.loanId"></el-input>
                </el-form-item>
                <el-form-item label="用户id">
                     <el-input v-model="form.userId"></el-input>
                </el-form-item>
                  <el-form-item label="银行流水号">
                    <el-input v-model="form.bankFlowNo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">回滚</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
         <dialogEE v-bind:dialogVisible="dialogVisible" ></dialogEE>
        
    </div>
</template>

<script>
  import dialogEE from './Dialog.vue';
  import verifyPermission from './Permission.vue';
    export default {
        data: function(){
            return {
               // url:"/api/backend/capital/withdrawFail",
               url:"/backend/capital/withdrawFail",
                dialogVisible: false,
                form: {
                    loanId: '',
                    userId: '',
                    bankFlowNo:''
                },
            }
        },
        components: {
            'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,    
        },
        created(){
        //       var CheckFunction =this.$store.state.FunctionUrl;           
        //    var Path=(this.$route.path).replace("/","");;
        //     if(CheckFunction.indexOf(Path)=="-1"){
        //         this.dialogVisible=true;
        //         return false;
        //     }

        },
        methods: {
            onSubmit() {
                let loanId=this.form.loanId;
                let userId=this.form.userId;
                let bankFlowNo=this.form.bankFlowNo;
        
                if(loanId=='' || userId=='' || bankFlowNo=='') {
                  this.$message.error('所有字段不能为空');
                  return false;
                }
                this.getData(loanId,userId,bankFlowNo);
                

            },
            getData(loanId,userId,bankFlowNo){
                let self = this;
                self.$axios.post(self.url, {"loanId":loanId,"userId":userId,"bankFlowNo":bankFlowNo}).then((res) => {
                 if(res.data.result=="0"){
                       this.$message.success('回滚成功');
                        this.form.loanId='';
                        this.form.userId='';
                        this.form.bankFlowNo='';
                 }else if (res.data.result=="-1"){
                   this.$message.error(res.data.resultMessage);
                 }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                 }else{
                    self.$message.error(res.data.resultMessage);
                 }
                
                   // this.$router.push({ path: 'productcreate1',query: { "productId": productId }});
                }).catch(function(err){

                   console.log("调用失败",err)
                })
            },
            onCancel(){
              this.form.loanId='';
              this.form.userId='';
              this.form.bankFlowNo='';
            }
        }
    }
</script>
