<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>催收</el-breadcrumb-item>
                <el-breadcrumb-item>催收列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
     
         <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" >         
             <el-table-column prop="borrowerId" label="UserID" width="80"></el-table-column>
            <el-table-column prop="phoneNumber" label="电话号码(No Telepon)" ></el-table-column>
            <el-table-column prop="borrowerName" label="姓名(Nama)"  ></el-table-column>
            <el-table-column prop="maxOverdueDay" label="最大逾期天数 (Jumlah tunggakkan paling banyak)"  ></el-table-column>
            <el-table-column prop="codeCount" label="code记录量(Catatan kode)"  sortable></el-table-column>
            <el-table-column prop="lastCollDayNum"  label="上次催收（天）(Desakan yang lalu-hari)"  sortable></el-table-column>
            <el-table-column prop="sumOwingPrincipal" label="逾期总额 (Jumlah tunggakkan)"  ></el-table-column>
            <el-table-column prop="promisePayDate"  :formatter="timetrans" label="承诺还款时间（Janji waktu pembayaran)"  width="200">
              <template slot-scope="scope">
                   <el-date-picker  v-model="scope.row.promisePayDate" type="date" placeholder="选择日期" @change="handleEdit(scope.$index, scope.row)"> </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="collNote" label="联系情况 （Keadaan kontak）"  >
              <template slot-scope="scope">
                 <el-input size="small" v-model="scope.row.collNote" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.collNote}}</span>
              </template>
            </el-table-column>
            </el-table-column>
            <el-table-column prop="lastLoginDate"  :formatter="timetrans" label=" 最后登录（Rekaman akhir）"  sortable></el-table-column>
            <el-table-column prop="ownerName"  label="owner"  ></el-table-column>
            <el-table-column prop="ownerName"  label="催收（Desakan）"  >
              <template slot-scope="scope">
                <el-button size="small" type="primary"   @click="handleRead(scope.$index, scope.row)"> 点击查看</el-button>
              </template>
            </el-table-column>
        </el-table>
          <div class="pagination">
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page.sync="currentPage"
                 :page-size="pageSize"
                 layout="total, prev, pager, next"
                 :total="totalNum">
           </el-pagination>
        </div>
        <verifyPermission></verifyPermission>

    </div>
</template>

<script>
 
    import verifyPermission from '../project/Permission.vue';
    export default {
        data() {
            return {
            url:"/backend/ICollBackendService/queryCollRecords",
            url1:"/backend/ICollBackendService/modifyCollRecord",
            //   url:"//172.20.15.48:9080/backend/ICollBackendService/queryCollRecords",
            //   url1:"//172.20.15.48:9080/backend/ICollBackendService/modifyCollRecord",
               tableData: [],
                currentPage:1,
                totalNum:0,
                pageSize:20,
                cur_page: 1,
                dateValue:''
             
            }
        },   
        components: {			 
            'verifyPermission':verifyPermission,
        },
        created(){
        //    var CheckFunction =this.$store.state.FunctionUrl;           
        //    var Path=(this.$route.path).replace("/","");;
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
            indexMethod(index) {
                return (index+1)+(this.cur_page-1)*this.pageSize;
            },
                handleSizeChange(val) {

            console.log(`每页 ${val} 条`);
          },
            handleCurrentChange(val){
                 let self = this;
                self.cur_page = val;
                self.queryData();
            },
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1);
           },
            queryData(){
                let self = this;
                self.$axios.post(self.url,{ "startPage": self.cur_page, "pageSize": self.pageSize }).then((res) => {
                    if(res.data.result=="0"){
                        self.tableData = res.data.content.list;   
                        self.totalNum=res.data.content.totalCount;  
                        self.pageSize=res.data.content.pageSize;                
                    }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }
                    
                })
            }, 
            handleRead(index,row){
                
                let self=this;
               
               let routeData = self.$router.resolve({ path: 'collectiondetails', query: { id: row.id,borrowerId:row.borrowerId}});
                window.open(routeData.href, '_blank');  

            },  
            handleEdit(index,row){
                 let self=this;
                  console.log(index, row.collNote);
                  let collId=row.id;
                  let collNote=row.collNote;
                  let promisePayDate=row.promisePayDate;
                    self.$axios.post(self.url1,{"collNote":collNote,"collId":collId,"promisePayDate":promisePayDate}).then((res) => {
                    if(res.data.result=="0"){
                         self.$message.success("修改成功！");               
                    }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }
                    
                })

            }, 
            daysTrans(row, column){
                var timestamp = new Date().getTime();
                 var date = row[column.property];
                var date = new Date(date);//如果date为13位不需要乘1000
                if (date == undefined) {
                    return "";
                } 
                var nTime = timestamp - date;
                var day = Math.floor(nTime / 86400000);
                //alert(day); 
                return day;  

            },
             timetrans:function(row, column) {  
               var date = row[column.property];  
                  var date = new Date(date);//如果date为13位不需要乘1000
                  if (date == undefined) {  
                      return "";  
                  }    
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;       
          }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 150px;
    display: inline-block;
}

.radio{
display: inline-block;
  margin-left: 50px;
  font-style: normal;
}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .title{
      padding: 1% 0;
      font-size: 14px;
      font-weight: bold;
  }
  .ellipsis{
      overflow: hidden; 
      text-overflow:ellipsis;
       white-space: nowrap;
  }
  
</style>

