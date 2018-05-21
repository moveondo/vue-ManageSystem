<template>
    <div>
           <verifyPermission></verifyPermission>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 资金</el-breadcrumb-item>
                <el-breadcrumb-item>资金充值</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="用户ID">
                    <el-select v-model="form.userId" placeholder="请选择">
                        <el-option key="bbk" label="投资账户" :value="5"> </el-option>
                        <el-option key="xtc" label="市场营销账户" :value="6"> </el-option>
                        <el-option key="xty" label="第三方手续费账户" :value="13"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值金额">
                    <el-input v-model="form.rechargeAmount"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-bind:disabled="isActive"  @click="onSubmit">充值</el-button>
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
               // url:"/api/backend/capital/recharge",
               url:"/backend/capital/recharge",
                 dialogVisible: false,
                  isActive:false,
                form: {
                    userId: '',
                    rechargeAmount: '',
                },
            }
        },
        components: {
			  'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission, 
        },
        created(){
        //    var CheckFunction =this.$store.state.FunctionUrl;           
        //    var Path=(this.$route.path).replace("/","");;
        //     if(CheckFunction.indexOf(Path)=="-1"){
        //         this.dialogVisible=true;
        //         return false;
        //     }
        },
        methods: {
            onSubmit() {
                 let self=this;
                let userId=self.form.userId;
                let rechargeAmount=self.form.rechargeAmount;
        
                if(userId=='' || rechargeAmount=='') {
                  self.$message.error('所有字段不能为空');
                  return false;
                }
                 self.isActive=true;
                self.getData(userId,rechargeAmount);
                

            },
            getData(userId,rechargeAmount){
                let self = this;
                self.$axios.post(self.url, {"userId":userId,"rechargeAmount":rechargeAmount}).then((res) => {
                 if(res.data.result=="0"){
                       self.$message.success('充值成功');
                        self.form.userId='';
                         self.form.rechargeAmount='';
                         self.isActive=false;

                 }else if (res.data.result=="-1"){
                   self.$message.error(res.data.resultMessage);
                   self.isActive=false;
                 }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                            self.isActive=false;
                 }else{
                    self.$message.error(res.data.resultMessage);
                    self.isActive=false;
                 }
                
                   // this.$router.push({ path: 'productcreate1',query: { "productId": productId }});
                }).catch(function(err){

                   console.log("调用失败",err)
                })
            },
            onCancel(){
              this.form.userId='';
              this.form.rechargeAmount='';
            }
        }
    }
</script>
