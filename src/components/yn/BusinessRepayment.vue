<template>
    <div>
        <verifyPermission></verifyPermission>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 业务</el-breadcrumb-item>
                <el-breadcrumb-item>还款差异</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标的id">
                    <el-input v-model="form.listingId"></el-input>
                </el-form-item>
                <el-form-item label="债务id">
                     <el-input v-model="form.debtId"></el-input>
                </el-form-item>
                  <el-form-item label="用户id">
                    <el-input v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-bind:disabled="isActive" @click="onSubmit">手动还款</el-button>
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
                //url:"http://172.20.15.48:8080/backend/IListingService/rollBackDebt",
                url:"/backend/IListingService/rollBackDebt",
                 dialogVisible: false,
                 isActive:false,
                form: {
                    listingId: '',
                    debtId: '',
                    userId:''
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
                let listingId=self.form.listingId;
                let debtId=self.form.debtId;
                let userId=self.form.userId;
        
                if(listingId=='' || userId=='' || debtId=='') {
                  self.$message.error('所有字段不能为空');
                  return false;
                }
                 self.isActive=true;
                self.getData(listingId,debtId,userId);
                

            },
            getData(listingId,debtId,userId){
                let self = this;
                self.$axios.post(self.url, {"listingId":listingId,"userId":userId,"debtId":debtId}).then((res) => {
                 if(res.data.result=="0"){
                       this.$message.success('回滚成功');
                        this.form.listingId='';
                        this.form.userId='';
                        this.form.debtId='';
                         self.isActive=false;
                 }else if (res.data.result=="-1"){
                   this.$message.error(res.data.resultMessage);
                    self.isActive=false;
                 }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
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
              this.form.debtId='';
              this.form.userId='';
              this.form.listingId='';
            }
        }
    }
</script>
