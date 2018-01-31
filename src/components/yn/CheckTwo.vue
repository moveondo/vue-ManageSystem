<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>审核(Verifikasi)</el-breadcrumb-item>
                <el-breadcrumb-item>审核列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <div class="first">二审列表</div>
        <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable">
            <el-table-column  prop="index"  label="序号"  width="150" >  </el-table-column>
            <el-table-column prop="listingId" label="listingid (daftar id)"></el-table-column>
            <!-- <el-table-column prop="userId" label="userId"  ></el-table-column> -->
            <el-table-column  label="userid (id pengguna)"  >
             <template scope="scope">
             
               <span > <router-link :to="{ path: '/checkpeople',query:{userId:scope.row.userId}}">{{ scope.row.userId }} </router-link> </span>
             </template>
           </el-table-column> 
            <el-table-column prop="listingTypeDesc" label="列表类型 (jenis tabel)"  ></el-table-column> 
            <el-table-column prop="ktpInfoauditResultStatus" label="KTP资料状态 (status data KTP)"></el-table-column>
            <el-table-column prop="bankCardInfoauditResultStatus" label="银行卡资料状态(status data bank)"></el-table-column>
         
            
            <el-table-column label="操作(operasi)" >
             <template scope="scope">
                  <el-button size="small" type="primary"  @click="handleRead(scope.$index, scope.row)">审核(verifikasi)</el-button>
                </template>
            </el-table-column>
        </el-table>
      <dialogEE v-bind:dialogVisible="dialogVisible" ></dialogEE>
  <verifyPermission></verifyPermission>
    </div>
</template>

<script>
    import dialogEE from './Dialog.vue';
    import verifyPermission from './Permission.vue';
    export default {
        data() {
            return {
               // url:"http://172.20.15.48:8080/backend/IListingService/getPendAuditListingList",
                url:"/backend/IListingService/getPendAuditListingList",
                tableData: Array(),
                cur_page: 1,
                auditStatus:'2',
                currentPage1:1,
                totalNum:0,
                pageSize:0,  
                dialogVisible:false          
            }     
        },
        components: {
			    'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,
        },
        created(){
           
        //    var CheckFunction1=Array();
        // //    var CheckFunction =this.$store.getters.getFunction;
        //      var CheckFunction =this.$store.state.FunctionUrl;
        // //    var FF =localStorage.getItem('ChangeFunction');
        // //    var CheckFunction1=FF.split(",");              
        //    var Path=(this.$route.path).replace("/","");
        // //    console.log(CheckFunction1);
           
        //     if(CheckFunction.indexOf(Path)=="-1"){
        //         this.dialogVisible=true;
        //         return false;
        //     }

            this.queryData();
        },
        computed: {
            data(){
                const self = this;
                if(self.tableData===null){
                    return self.tableData;
                }else{
                 return self.tableData.filter(function(d){
                     
                                      
                     return d;                                                                 
                    })
                }
            },

        },
        methods: {
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1)+(this.cur_page-1)*20;
           },   
           handleSizeChange(val) {

            console.log(`每页 ${val} 条`);
          },
            handleCurrentChange(val){
                this.cur_page = val;
                this.queryData();
            },

            queryData(){
                let self = this;
            //   let listingId,userId,bankCardInfoauditResultStatus,ktpInfoauditResultStatus;
                let params=Array();
                self.tableData=Array();
                var ktpInfoStatus,bankCardStatus;
                self.$axios.post(self.url, {"auditStatus":this.auditStatus,"startPage":1,"pageSize":20}).then((res) => {
                 
                  if(res.data.result==0){

                      let ContentLength=res.data.content.length;

                      for(let i = 0;i< ContentLength ;i++){
                 
                       if( res.data.content[i].listingInfo !=null){                       
                          var listingId = res.data.content[i].listingInfo.listingId;                                   
                          var userId = res.data.content[i].listingInfo.userId; 
                          var listingTypeDesc=res.data.content[i].listingInfo.listingTypeDesc; 
                                          
                       }
                
                       if( res.data.content[i].bankCardInfo !=null){
                       var bankCardInfoauditResultStatus = res.data.content[i].bankCardInfo.auditResultStatus; 

                            if(bankCardInfoauditResultStatus=="1"){
                                    bankCardStatus="待审核(menunggu verifikasi)";
                            }else if(bankCardInfoauditResultStatus=="0"){
                                    bankCardStatus="通过(terlewati)";
                            }else if(bankCardInfoauditResultStatus=="-1"){
                                    bankCardStatus="失败(Gagal)";
                            }                     
                       }

                      if( res.data.content[i].ktpInfo !=null){
                        var ktpInfoauditResultStatus = res.data.content[i].ktpInfo.auditResultStatus;


                          if(ktpInfoauditResultStatus=="1"){
                                    ktpInfoStatus="待审核 (menunggu verifikasi)";
                            }else if(ktpInfoauditResultStatus=="0"){
                                    ktpInfoStatus="通过 (terlewati)";
                            }else if(ktpInfoauditResultStatus=="-1"){
                                    ktpInfoStatus="失败(Gagal)";
                            }
                         
                       }
                   
                        self.tableData.push({
                               "userId":userId,
                               "listingId":listingId,
                               "listingTypeDesc":listingTypeDesc,
                               "bankCardInfoauditResultStatus":bankCardStatus,
                               "ktpInfoauditResultStatus":ktpInfoStatus
                        });           
  
                     }
                      
                  }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                  }else{
                    self.$message.error(res.data.resultMessage);
                  }
                    
                         

                })
            },
            index(row, column){
                return row.index;
            },
            formatter(row, column) {
              //console.log($index);
                return row.platformName;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleRead(index,row){
                //this.$message('查看'+(index+1)+'行');
                this.$router.push({ path: 'checkdetailtwo', query: { listingId: row.listingId, userId:row.userId}});
            }
        }
    }
</script>

<style scoped>

.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.radio{
display: inline-block;
  margin-left: 50px;
  font-style: normal;
}
</style>
