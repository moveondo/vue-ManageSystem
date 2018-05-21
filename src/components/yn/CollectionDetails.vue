<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>催收</el-breadcrumb-item>
                <el-breadcrumb-item>催收详情Catatan desakkan</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="person">
            <p class="self">个人信息Data pribadi:</p>
            <p class="self">
                <span>           
                 姓名(Nama): <router-link target="_blank" :to="{ path: '/checkpeople',query:{userId:this.userId}}"> {{userInfo.ktpName}}</router-link>
                </span>
                <span class="space">电话号码(No telepon)：{{userInfo.mobile}},</span>
                <span class="space">联系人1姓名(Nama kontak 1){{userInfo.contactName1}},</span>
                <p class="self"> 
                <span>联系人1电话(No telepon kontak 1):{{userInfo.contactMobile1}},</span>
                <span class="space">联系人2姓名(Nama kontak 2):{{userInfo.contactName2}},</span>
                <span class="space">联系人2电话(No telepon kontak 2):{{userInfo.contactMobile2}},</span>
                </p>
               <p class="self">
               <span>银行账号(No Rekening):{{userInfo.bankCardNo}},</span>
               <span class="space">所属银行(Bank):{{userInfo.bankName}},</span>
               </p >
                <p>单位信息(Data pekerjaan):</p>
               <p class="self">
                <span>行职业(bidang pekerjaan)：{{userInfo.workPosition}},</span>
               <span class="space"> 公司名称(nama perusahaan):{{userInfo.companyName}},</span>
               </p>
               <p class="self">
               <span>公司电话(nomor telepon perusahaan):{{userInfo.companyTel}},</span>
               <span class="space">公司地址 (alamat perusahaan):{{userInfo.workAddress}}</span>
               </p>                        
            </p>
        </div>
        <div class="title">标的listing:</div>
         <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName"  show-summary>         
             <el-table-column prop="listId" label="listingid" ></el-table-column>
            <el-table-column prop="prodType" label="产品类型 (Model Produk)" >
             <template slot-scope="scope">
                <!-- <div>{{ scope.row.BCFstatus}}</div> -->
                <div v-if="scope.row.prodType=='1'">
                   pdl
                </div>
                <div v-else>
                   installment
                </div>
            
            </template>       

            </el-table-column>
            <el-table-column prop="listAmount" label="借款金额(Jumlah pinjaman)"  ></el-table-column>
            <el-table-column prop="sumOwingPrincipal" label="逾期金额(Jumlah tunggakkan)"  ></el-table-column>
            <el-table-column prop="maxOverdueDay" label="逾期天数(Jumlah hari tunggakan)"  ></el-table-column>
            <el-table-column prop="sumOwingAmount" label=" 应还款金额(Jumlah yang harus dikembalikan)"  ></el-table-column>
        </el-table>
        
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="select">
            <el-form-item label="选择Pilih" prop="">
                <el-select v-model="ruleForm.value1" placeholder="请选择Pilih">
                    <el-option v-for="item1 in options1" :key="item1.value" :label="item1.label" :value="item1.value"></el-option>
                </el-select>
                    <el-select v-model="ruleForm.value2" placeholder="请选择Pilih">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="内容Konten" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc"  @input="descInput"></el-input>
                <span class="remnant">{{remnant}}/200</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>

      <div class="title">催收记录(Riwayat desakkan):</div>
      <el-table :data="data1" border style="width: 100%"  :row-class-name="tableRowClassName" >         
            <el-table-column prop="ownerName" label="操作人(Operator)" width="140" ></el-table-column>
            <el-table-column prop="inserttime"  :formatter="timetrans" label=" 操作时间(Waktu operasi)"  width="190"></el-table-column>
            <el-table-column prop="commCode" label="telepon contact" width="120" ></el-table-column>
            <el-table-column prop="commResult" label="code"  width="120"></el-table-column>
            <el-table-column prop="collNote" label="详细内容(Rincian)"  ></el-table-column>
     </el-table>

          <!-- <div class="pagination">
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page.sync="currentPage"
                 :page-size="pageSize"
                 layout="total, prev, pager, next"
                 :total="totalNum">
           </el-pagination>
        </div> -->
        <verifyPermission></verifyPermission>

    </div>
</template>

<script>
 
    import verifyPermission from '../project/Permission.vue';
    export default {
        data() {
            return {
               url:"/backend/ICollBackendService/queryCollDetail",
               url1:"/backend/ICollBackendService/addCommLog",
                // url:"//172.20.14.33:8080/backend/ICollBackendService/queryCollDetail",
                // url1:"//172.20.14.33:8080/backend/ICollBackendService/addCommLog",
               userInfo:{
                   ktpName:'',
                   mobile:'',
                   contactName1:'',
                   contactMobile1:'',
                   contactName2:'',
                   contactMobile2:'',
                   bankCardNo:'',
                   bankName:'',
                   workPosition:'',
                   companyName:'',
                   companyTel:'',
                   workAddress:''
               },
                tableData: [],
                logData:[],
                options1: [{
                 value: 'user',label: 'user'
                }, {
                  value: 'contact1',label: 'contact1'
                }, {
                 value: 'contact2', label: 'contact2'
                }, {
                 value: 'phone2', label: 'phone2'
                }, {
                 value: 'other', label: 'other'
                }],
                options2: [{ value: 'PTP', label: 'PTP'}, { value: 'LMS',  label: 'LMS'}, 
                {value: 'OPTP',label: 'OPTP' }, {value: 'NOAS',label: 'NOAS' },
                {value: 'CDLT', label: 'CDLT'}, { value: 'HPTP', label: 'HPTP' }, 
                { value: 'NOST', label: 'NOST' }
                ],
                ruleForm:{
                value1:'',
                value2:'',
                desc:''
                },
                remnant: 200,
                currentPage:1,
                totalNum:0,
                pageSize:20,
                cur_page: 1,
                userId:'',
            rules: {     
                region: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写内容', trigger: 'blur' }
                ]
           }
         };
        },
        components: {		
            'verifyPermission':verifyPermission, 
        },
        created(){
        let id=this.$route.query.id;
        let borrowerId=this.$route.query.borrowerId;
        this.userId= this.$route.query.borrowerId;
         
         this.queryData(id,borrowerId);

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
                if(self.logData===null){
                    return self.logData;
                }else{
                 return self.logData.filter(function(d){                             
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
                this.cur_page = val;
                self.queryData();
            },
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1);
           },
           descInput(){
                let self = this;
               var txtVal = this.ruleForm.desc.length;
               self.remnant = 200 - txtVal;
               if(self.remnant<0){
                   self.$message.error("已超过最大字数！");
               }
           },
            queryData(id,borrowerId){
                let self = this;
                self.$axios.post(self.url,{"collId":id,"borrowerId":borrowerId}).then((res) => {
                    if(res.data.result=="0"){
                        if(res.data.content.userInfo && res.data.content.userInfo !=null){
                          self.userInfo.ktpName=res.data.content.userInfo.ktpInfoResponseDto.ktpName;
                           self.userInfo.mobile=res.data.content.userInfo.mobile;
                        }
                        if(res.data.content.userInfo.twoThreeContactsInfoResponseDto && res.data.content.userInfo.twoThreeContactsInfoResponseDto !=null){
                          self.userInfo.contactName1=res.data.content.userInfo.twoThreeContactsInfoResponseDto.contactName1;
                         self.userInfo.contactMobile1=res.data.content.userInfo.twoThreeContactsInfoResponseDto.contactMobile1;
                         self.userInfo.contactName2=res.data.content.userInfo.twoThreeContactsInfoResponseDto.contactName2;
                         self.userInfo.contactMobile2=res.data.content.userInfo.twoThreeContactsInfoResponseDto.contactMobile2;
                        }
                        if(res.data.content.userInfo.userAuthBindBankCardResponseDto && res.data.content.userInfo.userAuthBindBankCardResponseDto !=null){
                         self.userInfo.bankCardNo=res.data.content.userInfo.userAuthBindBankCardResponseDto.bankCardNo;
                         self.userInfo.bankName=res.data.content.userInfo.userAuthBindBankCardResponseDto.bankName;
                        }
                        if(res.data.content.userInfo.workInfoResponseDto && res.data.content.userInfo.workInfoResponseDto!=null){
                        self.userInfo.workPosition=res.data.content.userInfo.workInfoResponseDto.workPosition;
                        self.userInfo.companyName=res.data.content.userInfo.workInfoResponseDto.companyName;
                        self.userInfo.companyTel=res.data.content.userInfo.workInfoResponseDto.companyTel;
                        self.userInfo.workAddress=res.data.content.userInfo.workInfoResponseDto.workAddress;
                        }
                                    
                        self.tableData=res.data.content.overdueLoan;
                        self.logData=res.data.content.commLog;
                           
                    }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }
                    
                })
            },
            submitData(){
             let self = this;
             let collNote = self.ruleForm.desc;
            let commLogCode = self.ruleForm.value1;
            let commLogResult = self.ruleForm.value2;
            let collId = this.$route.query.id;
              if (self.remnant < 0) {
                    self.$message.error("已超过最大字数！");
                    return false;
              }
            if (commLogCode =='' || commLogCode ==null) {
                    self.$message.error("联系人不能为空Kenalan tidak boleh kosong");
                    return false;
             }
             if (commLogResult == '' || commLogResult == null) {
                    self.$message.error("联系状态不能为空Status kontak tidak boleh kosong");
                    return false;
             }        
             self.$axios.post(self.url1, {"collNote":collNote,"commLogCode":commLogCode,"commLogResult":commLogResult,"collId":collId}).then((res) => {

                if(res.data.result==0){

                  self.$message.success("提交成功");
                  self.ruleForm.value1='';
                  self.ruleForm.value2='';
                  self.ruleForm.desc='';

                   let id=this.$route.query.id;
                    let borrowerId=this.$route.query.borrowerId;
                    
                    this.queryData(id,borrowerId);
              

                }else if( res.data.result=='-99' || res.data.result=='-999'){
                        self.$message.error(res.data.resultMessage);
                }else{
                    self.$message.error(res.data.resultMessage);
                }
                                      

            }) 
            },  
             submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                   this.remnant=200;
                   this.submitData();
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
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
.person{
    font-weight: 400;
    color: #606266;
    cursor: text;
}
.self{
    line-height: 27px;
}
.title{
    font-weight: bold;
    color: #303133;
}
.select{
    margin-top: 40px;
}
.remnant{
    float: right;
}
.space{
    margin-left: 23px;
}
  
</style>

