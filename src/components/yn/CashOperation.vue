<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 资金</el-breadcrumb-item>
                <el-breadcrumb-item>资金提现</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="标的id">
                    <el-input v-model="form.loanId"></el-input>
                </el-form-item>
                <el-form-item label="用户id">
                     <el-input v-model="form.userId"></el-input>
                </el-form-item>
                  <el-form-item label="银行账号">
                    <el-input v-model="form.bankNo"></el-input>
                </el-form-item>
                <el-form-item label="银行code">
                     <el-input v-model="form.bankCode"></el-input>
                </el-form-item>
                  <el-form-item label="真实姓名">
                    <el-input v-model="form.bankHolderName"></el-input>
                </el-form-item>
                <el-form-item label="提现金额">
                     <el-input v-model="form.amount"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                     <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提现</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
       <dialogEE v-bind:dialogVisible="dialogVisible" ></dialogEE>
          <verifyPermission></verifyPermission>
    </div>
    
</template>

<script>
   import dialogEE from './Dialog.vue';
  import verifyPermission from './Permission.vue';
    export default {
        data: function(){
            return {
                // url:"/api/backend/capital/withdrawDeposit",
                 url:"/backend/capital/withdrawDeposit",
                dialogVisible: false,
                form: {
                    loanId: '',
                    userId: '',
                    bankNo: '',
                    bankCode:'',
                    bankHolderName:'',
                    amount:'',
                    description:'',
                  
                },
            }
        },
        components: {
			   'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,  
        },
        created(){
        //     var CheckFunction1=Array();
        // //    var CheckFunction =this.$store.getters.getFunction;
        //    var CheckFunction =this.$store.state.FunctionUrl;
           
        // //    var FF =localStorage.getItem('ChangeFunction');
        // //    var CheckFunction1=FF.split(",");   
        //     console.log(CheckFunction);
                      
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
                let bankNo=this.form.bankNo;
                let bankCode=this.form.bankCode;
                let bankHolderName=this.form.bankHolderName;
                let amount=this.form.amount;
                let description=this.form.description;

                if(loanId=='' ||userId=='' || bankNo=='' || bankCode=='' || bankHolderName=='' || amount=='') {
                  this.$message.error('除描述字段外其余字段不能为空');
                  return false;
                }
                this.getData(loanId,userId,bankNo,bankCode,bankHolderName,amount,description);
                

            },
            getData(loanId,userId,bankNo,bankCode,bankHolderName,amount,description){
                let self = this;
                self.$axios.post(self.url, {"loanId":loanId,"userId":userId,"bankNo":bankNo,"bankCode":bankCode,"bankHolderName":bankHolderName,"amount":amount,"description":description}).then((res) => {
                 if(res.data.result=="0"){
                       this.$message.success('保存成功');
                        this.form.loanId='';
                        this.form.userId='';
                        this.form.bankNo='';
                        this.form.bankCode='';
                        this.form.bankHolderName='';
                        this.form.amount='';
                        this.form.description='';
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
              this.form.bankNo='';
              this.form.bankCode='';
              this.form.bankHolderName='';
              this.form.amount='';
              this.form.description='';
            }
        }
    }
</script>
