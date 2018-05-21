<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>审核(Verifikasi)</el-breadcrumb-item>
                <el-breadcrumb-item>审核列表(Susunan verifikasi pertama)</el-breadcrumb-item>
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

       <div class="first">初审列表(Susunan verifikasi pertama)</div>
        <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable"   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"  @selection-change="handleSelectionChange"
     :default-sort = "{prop: 'ownerName', order: 'descending'}">
    <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column  type="index"   :index="indexMethod" label="序号(Nomor urutan)"  width="150" >  </el-table-column>
            <el-table-column prop="listingId" label="listingid (daftar id) "></el-table-column>
            <!-- <el-table-column prop="userId" label="userId"  ></el-table-column> -->
            <el-table-column  label="userid (id pengguna)"  >
             <template slot-scope="scope">
             
               <span > <router-link target="_blank" :to="{ path: '/checkpeople',query:{userId:scope.row.userId}}">{{ scope.row.userId }} </router-link> </span>
             </template>
           </el-table-column> 
            <el-table-column prop="listingTypeDesc" label="列表类型 (jenis tabel)"  ></el-table-column> 
            <el-table-column prop="ktpInfoauditResultStatus" label="KTP资料状态 (status data KTP)"></el-table-column>
            <el-table-column prop="bankCardInfoauditResultStatus" label="银行卡资料状态 (status data bank)"></el-table-column>
            <el-table-column prop="droolsProcessFlag" label="drools result"></el-table-column>
            <el-table-column prop="ownerName" label="ownerName" sortable></el-table-column>
            <el-table-column label="操作 (operasi)" >
             <template slot-scope="scope">
                  <el-button size="small" type="primary"  
                   @click="handleRead(scope.$index, scope.row)"  :id="gernerateId(scope.$index)">审核 (verifikasi)</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="ower"  :class="{'ifhide':ifhide}">
            <el-select v-model="ower" placeholder="请选择">
                <el-option v-for="(item, index) of owerList" :key="item.auditorId" :label="item.auditorName" :value="item.auditorId"></el-option>
            </el-select>
            <el-button type="warning"  v-bind:disabled="isActive" @click="assortOwer">分配owner</el-button>
        </div>
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

           <verifyPermission></verifyPermission>
    </div>
</template>

<script>
    // import dialogEE from './Dialog.vue';
    import verifyPermission from './Permission.vue';
    export default {
        data() {
            return {
                // url:"http://172.20.14.33:8080/backend/IListingService/getPendAuditListingList",
                // url1: "http://172.20.14.33:8080/backend/permission/queryFirstAuditor",
                // url2:"http://172.20.14.33:8080/backend/permission/firstAuditEndowPermission",
                url:"/backend/IListingService/getPendAuditListingList",
                url1:"/backend/permission/queryFirstAuditor",
                url2: "/backend/permission/firstAuditEndowPermission",
                tableData: Array(),
                cur_page: 1,
                auditStatus:'1',
                currentPage1:1,
                totalNum:0,
                pageSize:20,
                dialogVisible: false,
                loading:false,
                region:'',
                userIdORphone:'',
                is_search:'',
                listingId:'',
                userId:'',
                multipleSelection: [],
                ower:'',
                ifhide:false,
                owerList:[],
                keepName:[],
                listingIds:[],
                 isActive: false,
            }
        },
        components: {
			//   'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,
        },
        created(){
              
           this.queryOwner();
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
               
               row.index = (index+1)+(this.cur_page-1)*this.pageSize;
             
           }, 
           handleSizeChange(val) {

            console.log(`每页 ${val} 条`);
          },
            handleCurrentChange(val){
                 let self = this;
                this.cur_page = val;
                self.queryData(self.cur_page,self.pageSize,self.userId,self.listingId);
            },
            assortOwer(){
                let self = this;
                let auditorId=self.ower;
                let auditorName= self.keepName[auditorId];
                let listingIds=self.listingIds;
                 self.isActive = true;
                self.$axios.post(self.url2,{ "auditorId": auditorId, "auditorName": auditorName, "listingIds": listingIds}).then((res) => {
                    if (res.data.result == 0 && res.data.content == true) {
                        self.$message.success('分配成功！');
                          self.isActive = false;
                         self.queryData(self.cur_page, self.pageSize, self.userId, self.listingId);
                    }else if (res.data.result == '-99' || res.data.result == '-999') {
                        self.$message.error(res.data.resultMessage);
                         self.isActive = false;
                    }else if(res.data.content == false) {
                        self.$message.success('分配失败！');
                         self.isActive = false;
                    } 

                }).catch(function (err) {
                    console.log("调用失败", err)
                })
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
            queryOwner(){
                let self = this;
                self.$axios.post(self.url1).then((res) => {
                    if (res.data.result == 0) {

                      self.owerList=res.data.content;
                      if(self.owerList && self.owerList.length>0){
                          let owerLength = self.owerList.length;
                          for (let i = 0; i < owerLength; i++) {
                              self.keepName[self.owerList[i].auditorId] = self.owerList[i].auditorName;
                          }                      
                      }else{
                         
                          self.ifhide=true;
                      }               
                    }

                }).catch(function (err) {
                    console.log("调用失败", err)
                })
            },
            queryData(cur_page,pageSize,userId,listingId){
                let self = this;
            //   let listingId,userId,bankCardInfoauditResultStatus,ktpInfoauditResultStatus;
                let params=Array();
                self.tableData=Array();
                let axiosDate = new Date();
                self.loading=true;
                var ktpInfoStatus,bankCardStatus,droolsStatus;
                self.$axios.post(self.url, {"auditStatus":self.auditStatus,"startPage":cur_page,"pageSize":pageSize,"userId":userId,"listingId":listingId}).then((res) => {

                    if(res.data.result==0){

                        let oDate = new Date()
                        let time = oDate.getTime() - axiosDate.getTime()
                        if (time < 300) time = 300
                        setTimeout(() => {
                          self.loading=false;
                        }, time)

                           let ContentLength=res.data.content.list.length;
                           self.totalNum=res.data.content.totalCount;
                       
                          

                      for(let i = 0;i< ContentLength ;i++){
                         
                       if( res.data.content.list[i].listingInfo !=null){                       
                          var listingId = res.data.content.list[i].listingInfo.listingId;                                   
                          var userId = res.data.content.list[i].listingInfo.userId; 
                          var listingTypeDesc=res.data.content.list[i].listingInfo.listingTypeDesc; 
                          var ownerName= res.data.content.list[i].listingInfo.ownerName; 
                          var droolsProcessFlag=res.data.content.list[i].listingInfo.droolsProcessFlag; 

                           if(droolsProcessFlag=="0"){
                                    droolsStatus="拒绝(ditolak)";
                            }else if(droolsProcessFlag=="1"){
                                    droolsStatus="通过(terlewati)";
                            }else if(droolsProcessFlag=="2"){
                                    droolsStatus="人工(review)";
                            }else if(droolsProcessFlag==null){
                                    droolsStatus="";
                            }
                       }
                
                       if( res.data.content.list[i].bankCardInfo !=null){
                       var bankCardInfoauditResultStatus = res.data.content.list[i].bankCardInfo.auditResultStatus; 

                            if(bankCardInfoauditResultStatus=="1"){
                                    bankCardStatus="待审核(menunggu verifikasi)";
                            }else if(bankCardInfoauditResultStatus=="0"){
                                    bankCardStatus="通过(terlewati)";
                            }else if(bankCardInfoauditResultStatus=="-1"){
                                    bankCardStatus="失败(Gagal)";
                            }else if(bankCardInfoauditResultStatus==null){
                                    bankCardStatus="";
                            }
                        
                       
                       }

                      if( res.data.content.list[i].ktpInfo !=null){
                        var ktpInfoauditResultStatus = res.data.content.list[i].ktpInfo.auditResultStatus;


                          if(ktpInfoauditResultStatus=="1"){
                                    ktpInfoStatus="待审核(menunggu verifikasi)";
                            }else if(ktpInfoauditResultStatus=="0"){
                                    ktpInfoStatus="通过(terlewati)";
                            }else if(ktpInfoauditResultStatus=="-1"){
                                    ktpInfoStatus="失败(Gagal)";
                            }else if(ktpInfoauditResultStatus==null){
                                    ktpInfoStatus="";
                            }
                         
                       }
                   
                        self.tableData.push({
                               "userId":userId,
                               "listingId":listingId,
                               "listingTypeDesc":listingTypeDesc,
                               "bankCardInfoauditResultStatus":bankCardStatus,
                               "ktpInfoauditResultStatus":ktpInfoStatus,
                               "droolsProcessFlag":droolsStatus,
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
                console.log(index);
                let self=this;
                //  console.log(event.target.innerText);
                var but1 = document.getElementById('text'+index);
                 but1.style.color = '#6600FF';
               let routeData = self.$router.resolve({ path: 'checkdetail', query: { listingId: row.listingId}});
                window.open(routeData.href, '_blank');          

            },
             handleSelectionChange(val) {
                    let self = this;
                self.listingIds=[];
                self.multipleSelection = val;
                if(self.multipleSelection && self.multipleSelection.length>0){
                    let SelectionLength= self.multipleSelection.length;
                    for(let j=0;j< SelectionLength;j++){
                        self.listingIds.push(self.multipleSelection[j].listingId)
                    }
                }
               // console.log(this.listingIds);
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
.first{
    margin: 5px 0;
}
.purple{
    color: #6600FF;
}
.ower{
    margin-top: 20px;
}
.ifhide{
    display: none;
}
</style>
