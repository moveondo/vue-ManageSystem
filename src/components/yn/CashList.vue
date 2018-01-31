<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>资金</el-breadcrumb-item>
                <el-breadcrumb-item>资金列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            标的ID:<el-input v-model="listingId"  placeholder="筛选标的ID"  class="handle-input mr10"></el-input>
            债务ID:<el-input v-model="debtId"  placeholder="筛选债务ID"  class="handle-input mr10"></el-input>
            支付业务编号：<el-input v-model="businessNo"  placeholder="筛选支付业务编号" class="handle-input mr10"></el-input>
            支付银行交易编号：<el-input v-model="bankTradeCode"  placeholder="筛选银行交易编号"  class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
         <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" :row-key="getRowKeys"
                :expand-row-keys="expands" @current-change="toggleRowExpansion" >
            <el-table-column type="expand" >
                <template scope="props">
                    <div  class="title">主流水</div>            
                    <el-table :data="acctWastebookDtos" border style="width: 100%" >
                     <el-table-column prop="tradeflowNo" label="交易单号" ></el-table-column>
                     <el-table-column prop="bankflowNo" label=" 银行流水号" ></el-table-column>
                     <el-table-column prop="changeType" label="业务动作" ></el-table-column>          
                     <el-table-column prop="optStateName" label="处理状态" ></el-table-column>
                     <el-table-column prop="tradetime" label="交易时间"  :formatter="timetrans" ></el-table-column>
                     <el-table-column prop="bsnsCodeMemo" label="业务单号" ></el-table-column>
                    </el-table>
                     <hr style=" height:2px;border:none;border-top:2px dotted #555555;margin:10px 0" />
                      <div class="title">流水明细</div>  
                    <el-table :data="wastebookSubDtos" border style="width: 100%" >
                    <el-table-column prop="tradeflowNo" label="交易单号" ></el-table-column>
                     <el-table-column prop="seatCode1" label="席位号1" ></el-table-column>
                     <el-table-column prop="seatCode2" label="席位号2" ></el-table-column>
                     <el-table-column prop="acctCode1" label=" 账号1" ></el-table-column>
                     <el-table-column prop="acctCode2" label="  账号2" ></el-table-column>
                     <el-table-column prop="optMoney" label="操作金额" ></el-table-column>
                     <el-table-column prop="optName" label="操作类型"  ></el-table-column>
                     <el-table-column prop="frontAvailable" label="操作前可用" ></el-table-column>
                      <el-table-column prop="frontDeposit" label="操作前冻结" ></el-table-column>
                     <el-table-column prop="available" label="当前可用" ></el-table-column>
                     <el-table-column prop="deposit" label="当前冻结"  ></el-table-column>
                     <el-table-column prop="memo" label="业务备注" ></el-table-column>
                     <el-table-column prop="operSeq" label="操作序号"  ></el-table-column>
                     <el-table-column prop="optUsageName" label="用途类型"  ></el-table-column>
                    </el-table>
                    <hr style=" height:2px;border:none;border-top:2px dotted #555555;margin:10px 0" />
                     <div  class="title"  @click="dialogTableVisible = true">资金网关(点击查看详情)</div>  
                   <el-table :data="data1" border style="width: 100%"  >
                     <el-table-column prop="bizId" label="交易单号" ></el-table-column>
                     <el-table-column prop="callBackId" label="银行流水号" ></el-table-column>
                     <el-table-column prop="bizType" label=" 业务类型" ></el-table-column>
                     <el-table-column prop="parameterInfo" label="调用信息"  :formatter="SubStr"></el-table-column>
                     <el-table-column prop="resultInfo" label="返回信息"  :formatter="SubStr" ></el-table-column>
                    </el-table>

                </template>
            </el-table-column>
             <el-table-column  prop="index"  label="序号" width="100px">  </el-table-column>
             <el-table-column prop="id" label="主键" ></el-table-column>
            <el-table-column prop="tradeType" label="交易类型" ></el-table-column>
            <el-table-column prop="tradeTypeName" label="交易类型名称"  ></el-table-column>
            <el-table-column prop="wasteBookId" label="主流水编号"  ></el-table-column>
            <el-table-column prop="userId" label="用户ID"  ></el-table-column>
            <el-table-column prop="listingId" label=" 标的ID"  ></el-table-column>
            <el-table-column prop="debtId" label="债务ID"  ></el-table-column>
            <el-table-column prop="businessNo" label="支付业务编号"  ></el-table-column>
            <el-table-column prop="bankTradeCode" label="银行交易编号"  ></el-table-column>
            <el-table-column prop="statusName" label=" 状态名称"  ></el-table-column>
            <el-table-column prop="inserttime"   :formatter="timetrans"   label="插入时间"  ></el-table-column>
            <el-table-column prop="updatetime"   :formatter="timetrans"   label="更新时间"  ></el-table-column>
        </el-table>
        <el-dialog title="收货地址" :visible.sync="dialogTableVisible" style="width: 100%">
            <el-table :data="data1">
                 <el-table-column prop="bizId" label="交易单号" ></el-table-column>
                     <el-table-column prop="callBackId" label="银行流水号" ></el-table-column>
                     <el-table-column prop="bizType" label=" 业务类型" ></el-table-column>
                       <el-table-column prop="parameterInfo" label="调用信息"  ></el-table-column>
                     <el-table-column prop="resultInfo" label="返回信息"  ></el-table-column>
            </el-table>
        </el-dialog>

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
               //url:"/api/backend/capital/queryTradeRecord",
                url:"/backend/capital/queryTradeRecord",
               listingId:'',
               businessNo:'',
               bankTradeCode:'',
               debtId:'',
               del_list: [],
               tableData: [],
               GetDtos:[],
               AccDots:[],
               WasDtos:[],
               rowArray:[],
               params:[],
               expands: [],
               dialogTableVisible: false,
               dialogVisible: false,       
               getRowKeys(row) {
                return row.businessNo;
               },
               form: {
                    changeType: '',
                    tradeflowNo: '',
                    bankflowNo: '',
                    optStateName:'',
                    tradetime:'',
                    bsnsCodeMemo:''
                }
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
            data1(){
                 const self = this;
                if(self.GetDtos===null){
                    return self.GetDtos;
                }else{
                 return self.GetDtos.filter(function(d){    
                                               
                         return d;                                                            
                    })
                }
            },
            acctWastebookDtos(){
                 const self = this;
                if(self.AccDots===null){
                    return self.AccDots;
                }else{
                 return self.AccDots.filter(function(d){                                                
                     return d;                                                                          
                    })
                }
            },
            wastebookSubDtos(){
                  const self = this;
                if(self.WasDtos===null){
                    return self.WasDtos;
                }else{
                 return self.WasDtos.filter(function(d){
                     console.log(d.length);
                                                                 
                     return d;                                                                 
                    })
                }

            }

        },
        methods: {
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1);
           },
           toggleRowExpansion(row){
                this.QueryBusinessNo(row.businessNo);
                this.expands = [];
                this.expands.push(row.businessNo);  
               
                        
           },   
           QueryBusinessNo(businessNo){
                let self = this;
               

                 self.$axios.get("/backend/capital/queryTradeDetail?businessNo="+businessNo).then((res) => {
                   if(res.data.result=="0"){
                         self.params =res.data.content;
                         self.GetDtos=[];
                         self.AccDots=[];
                         self.WasDtos=[];
                         self.GetDtos=self.params.gatewayRecordDtos;
                         self.AccDots=self.params.acctWastebookDtos;//主流水
                                   
                         let Length=self.params.acctWastebookDtos.length;
                  
                         for(let i = 0;i< Length ;i++){
                 
                            let Length1=self.params.acctWastebookDtos[i].wastebookSubDtos.length;//流水明细
                            for(let j=0;j<Length1;j++){
                            
                                self.WasDtos.push(self.params.acctWastebookDtos[i].wastebookSubDtos[j]);
                            }
  
                         }                                                    
                   }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }
                      
                })
           }, 
            queryData(listingId,debtId,businessNo,bankTradeCode){
                let self = this;
                self.$axios.post(self.url, {"listingId":listingId,"debtId":debtId,"businessNo":businessNo,"bankTradeCode":bankTradeCode}).then((res) => {
                    if(res.data.result=="0"){
                        self.tableData = res.data.content;                     
                    }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }
                    
                })
            },   
            search(){
                this.is_search = true;
                let listingId=this.listingId;
                let businessNo=this.businessNo;
                let bankTradeCode=this.bankTradeCode;
                let debtId=this.debtId;
        
                if(listingId=='' &&  businessNo=='' && bankTradeCode=='' && debtId=='') {
                  this.$message.error('所有字段不能同时为空！');
                  return false;
                }
                  if(listingId !='' &&  businessNo !='' && bankTradeCode !='' && debtId!='') {
                  this.$message.error('所有字段不能同时有值！');
                  return false;
                }
             
                this.queryData(this.listingId,this.debtId,this.businessNo,this.bankTradeCode);
            },
            SubStr:function(row,column){
              var str = row[column.property]; 
              this.rowArray[row.id]=row[column.property];

             return str.substr(0, 20)+".....";
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
<style>
.el-dialog{
    width: 70% !important;
}
</style>
