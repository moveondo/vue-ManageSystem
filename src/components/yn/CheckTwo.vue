<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>审核(Verifikasi)</el-breadcrumb-item>
                <el-breadcrumb-item>审核列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">     
           <el-select v-model="region" placeholder="请选择">
                        <el-option key="bbk" label="用户ID(ID pengguna)" value="1"></el-option>
                        <el-option key="xtc" label="标的ID(daftar id)" value="2"></el-option>
           </el-select>
         <el-input v-model="userIdORphone"  placeholder="不可为空"  class="handle-input mr10"></el-input>
         <el-button type="primary" icon="search" @click="search">搜索(Mencari)</el-button>
        </div>
       <div class="first">二审列表</div>
        <el-table :data="data"  v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable">
            <el-table-column type="index" :index="indexMethod" prop="index"  label="序号"  width="150" >  </el-table-column>
            <el-table-column prop="listingId" label="listingid (daftar id)"></el-table-column>
            <!-- <el-table-column prop="userId" label="userId"  ></el-table-column> -->
            <el-table-column  label="userid (id pengguna)"  >
             <template slot-scope="scope">
             
               <span > <router-link  target="_blank"  :to="{ path: '/checkpeople',query:{userId:scope.row.userId}}">{{ scope.row.userId }} </router-link> </span>
             </template>
           </el-table-column> 
            <el-table-column prop="listingTypeDesc" label="列表类型 (jenis tabel)"  ></el-table-column> 
            <el-table-column prop="ktpInfoauditResultStatus" label="KTP资料状态 (status data KTP)"></el-table-column>
            <el-table-column prop="bankCardInfoauditResultStatus" label="银行卡资料状态(status data bank)"></el-table-column>
            <el-table-column prop="ownerName" label="ownerName"></el-table-column>
            
            <el-table-column label="操作(operasi)" >
             <template slot-scope="scope">
                  <el-button size="small" type="primary" :id="gernerateId(scope.$index)"
                   @click="handleRead(scope.$index, scope.row)">审核(verifikasi)</el-button>
                </template>
            </el-table-column>
        </el-table>
           <div class="pagination">
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page.sync="currentPage1"
                 :page-size="pageSize"
                 layout="total, prev, pager, next"
                 :total="totalNum">
           </el-pagination>
        </div>
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
                //url:"http://172.20.15.13:2020/backend/IListingService/getPendAuditListingList",
                url:"/backend/IListingService/getPendAuditListingList",
                tableData: Array(),
                cur_page: 1,
                auditStatus:'2',
                currentPage1:1,
                totalNum:0,
                pageSize:20,  
                dialogVisible:false,
                loading:false,
                 region:'',
                userIdORphone:'',
                is_search:'',
                listingId:'',
                userId:'' ,
                // activeIndex:{},
                // tabIndex: 0         
            }     
        },
        components: {
			    'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,
        },
        created(){

               
           this.queryData(this.cur_page,this.pageSize,this.userId,this.listingId);
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
          gernerateId: function (index){

             return "text" +index

            },
          indexMethod(index) {
              return (index+1)+(this.cur_page-1)*this.pageSize;
           },
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1)+(this.cur_page-1)*this.pageSize;
           },   
           handleSizeChange(val) {

            console.log(`每页 ${val} 条`);
          },
            handleCurrentChange(val){
                 let self = this;
                self.cur_page = val;
              self.queryData(self.cur_page,self.pageSize,self.userId,self.listingId);
            },
            search(){
                 let self = this;
                 self.is_search = true;
                 let userIdORphone=self.userIdORphone;
                 let region=self.region;
                        
                if(userIdORphone=='') {
                  self.$message.error('不能为空(userId tidak boleh kosong)！');
                  return false;
                }
                if(region==1){
                     self.userId=self.userIdORphone;
                     self.listingId="";
                     self.queryData(self.cur_page,self.pageSize,self.userId,self.listingId);
                 }
                if(region==2){
                     self.listingId=self.userIdORphone;
                      self.userId="";
                      self.queryData(self.cur_page,self.pageSize,self.userId,self.listingId);
                 }
                      
            },
            queryData(cur_page,pageSize,userId,listingId){
                let self = this;
            //   let listingId,userId,bankCardInfoauditResultStatus,ktpInfoauditResultStatus;
                let params=Array();
                self.tableData=Array();
                 let axiosDate = new Date();
                 self.loading=true;
                var ktpInfoStatus,bankCardStatus;
                self.$axios.post(self.url, {"auditStatus":this.auditStatus,"startPage":cur_page,"pageSize":pageSize,"userId":userId,"listingId":listingId}).then((res) => {
                 
                  if(res.data.result==0){

                    let oDate = new Date()
                    let time = oDate.getTime() - axiosDate.getTime()
                    if (time < 500) time = 500
                    setTimeout(() => {
                       self.loading=false;
                    }, time)

                      let ContentLength=res.data.content.list.length;
                       self.totalNum=res.data.content.totalCount;
                         //  console.log("ContentLength"+ContentLength);

                      for(let i = 0;i< ContentLength ;i++){
                 
                       if( res.data.content.list[i].listingInfo !=null){                       
                          var listingId = res.data.content.list[i].listingInfo.listingId;                                   
                          var userId = res.data.content.list[i].listingInfo.userId; 
                          var listingTypeDesc=res.data.content.list[i].listingInfo.listingTypeDesc; 
                          var ownerName = res.data.content.list[i].listingInfo.ownerName;              
                       }
                
                       if( res.data.content.list[i].bankCardInfo !=null){
                       var bankCardInfoauditResultStatus = res.data.content.list[i].bankCardInfo.auditResultStatus; 

                            if(bankCardInfoauditResultStatus=="1"){
                                    bankCardStatus="待审核(menunggu verifikasi)";
                            }else if(bankCardInfoauditResultStatus=="0"){
                                    bankCardStatus="通过(terlewati)";
                            }else if(bankCardInfoauditResultStatus=="-1"){
                                    bankCardStatus="失败(Gagal)";
                            }                     
                       }

                      if( res.data.content.list[i].ktpInfo !=null){
                        var ktpInfoauditResultStatus = res.data.content.list[i].ktpInfo.auditResultStatus;


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
                               "ktpInfoauditResultStatus":ktpInfoStatus,
                               "ownerName": ownerName
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
               let self=this;
            //    self.$set(self.activeIndex, self.tabIndex, index)
            //    self.activeIndex[index]=index;
                 //  console.log(event.target.innerText);
                var but1 = document.getElementById('text'+index);
                 but1.style.color = '#6600FF';


                let routeData = self.$router.resolve({ path: 'checkdetailtwo', query: { listingId: row.listingId}});
                window.open(routeData.href, '_blank');         
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
.purple{
    color: #6600FF;
}
</style>
