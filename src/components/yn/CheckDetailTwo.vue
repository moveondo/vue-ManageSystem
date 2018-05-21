<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>审核(verifikasi)</el-breadcrumb-item>
                <el-breadcrumb-item>审核信息(Verifikasi data)</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <div class="message"  >
               <table class="table table-striped table-bordered">             
                   <tbody>
                     <tr v-for="(item, index) of UserMessage" >
                       <td>基本信息(Data dasar):</td>
                       <td><router-link target="_blank" :to="{ path: '/checkpeople',query:{userId:item.userId}}">{{item.ktpName}}</router-link> ,</td>
                       <td>(列表(Susunan)ID:{{item.id}}, </td>
                       <td>¥:{{item.amount}}, </td>
                       <td>{{item.periodNo+item.termUnit}} , </td>
                       <td>{{item.statusName}} ) </td>
                     </tr>
                   </tbody>
              </table>              
       </div>
       <el-table :data="tableData"  style="width: 100%">
        <el-table-column prop="Dataitem" label="资料项(Bagian data)"  width="180"></el-table-column>
        <el-table-column prop="ktpPhotoUrl" label="图片1(Gambar)" width="180" header-align="center">
            <template  slot-scope="scope">
                 <span v-if="scope.row.ktpPhotoUrl"  @click = "ClickImg(scope.row.ktpPhotoUrl,scope.row)" > <img :src="scope.row.ktpPhotoUrl" width="90" height="90"/></span>
                 <span v-else>  </span>         
            </template>
        </el-table-column>
        <el-table-column prop="ktpSelfPhotoUrl" label="图片2(Gambar)"  width="180">
             <template  slot-scope="scope">
                 <span v-if="scope.row.ktpSelfPhotoUrl"  @click = "ClickImg(scope.row.ktpSelfPhotoUrl,scope.row)"  > <img :src="scope.row.ktpSelfPhotoUrl" width="90" height="90"/></span>
                 <span v-else>  </span>         
            </template>
        </el-table-column>
        <el-table-column  label="资料审核(Verifikasi data)">
              <template slot-scope="scope">
                <!-- <div>{{ scope.row.BCFstatus}}</div> -->
                <div v-if="scope.$index==1 && scope.row.BCFstatus=='-1'">
                  <el-button size="small" type="primary"   @click="Verify(scope.$index, scope.row)">通过(terlewati)</el-button>    
                  <el-button size="small" type="warning"  @click="Refuse(scope.$index, scope.row)">拒绝 (tolak)</el-button> 
                </div>
                 <div v-else-if="scope.$index==1 && scope.row.BCFstatus=='0'">
                  <el-button size="small" type="primary"  @click="Verify(scope.$index, scope.row)">通过(terlewati)</el-button>    
                  <el-button size="small" type="warning" disabled @click="Refuse(scope.$index, scope.row)">拒绝 (tolak)</el-button>     
                </div>
                 <div v-else-if="scope.$index==1 && scope.row.BCFstatus=='1'">
                   <el-button size="small" type="primary" disabled @click="Verify(scope.$index, scope.row)">通过(terlewati)</el-button>    
                  <el-button size="small" type="warning" disabled @click="Refuse(scope.$index, scope.row)">拒绝 (tolak)</el-button>     
                </div>
                <div v-else-if="scope.$index==1 && scope.row.BCFstatus=='2'">
                   <el-button size="small" type="primary"  @click="Verify(scope.$index, scope.row)">通过(terlewati)</el-button>    
                   <el-button size="small" type="warning"  @click="Refuse(scope.$index, scope.row)">拒绝 (tolak)</el-button>    
                </div>
                <div v-else-if="scope.$index==0">
                    <el-button size="small" type="primary"  @click="Verify(scope.$index, scope.row)">通过(terlewati)</el-button>               
                    <el-button size="small" type="warning"  @click="Refuse(scope.$index, scope.row)">拒绝 (tolak)</el-button>
                </div>
            
            </template>       
        </el-table-column>
        <el-table-column prop="status" label="审核状态(status verifikasi)"  width="180"></el-table-column>
      </el-table>


         <div class="ktpInfo">
            <div class="Order">
                <div class="text"  @click = "ClickImglive()">活体照片(Foto wajah):
                    <img v-bind:src="liveDetectPhotoUrl" /> 
                </div>
            </div>
            <div class="Order">
                <div class="text">活体认证结果(Hasil otentikasi wajah):{{detectFlag}} </div>
            </div>
        </div>

        <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="select" style="margin-top:60px;">
            <el-form-item label="选择Pilih" prop="">
                <el-select v-model="ruleForm.value1" placeholder="请选择Pilih">
                    <el-option v-for="item1 in answerPeople" :key="item1.value" :label="item1.option" :value="item1.value"></el-option>
                </el-select>
                <el-select v-model="ruleForm.value2" placeholder="请选择Pilih">
                    <el-option v-for="item in answerResult" :key="item.value" :label="item.option" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" @click="submitForm('ruleForm')">提交(Kirim)</el-button>
                <el-tag>
                    <router-link target="_blank" :to="{ path: '/internalrecord',query:{userId:this.userId}}">内部记录 (Catatan internal)</router-link>
                </el-tag>
                <el-tag>
                    <router-link target="_blank" :to="{ path: '/auditrecord',query:{userId:this.userId}}">listing审核记录 (Catatan audit)</router-link>
                </el-tag>
            </el-form-item>
        </el-form>


        <div class="first" >
            二审核实（中国）Pra verifikasi (China)
           <span v-model="listingStatus"> 审核状态(status verifikasi):{{listingStatus}}</span>
        </div>
        <hr/>
        <div class="check" >
          <div v-if=" active===true ">
           <el-button type="primary" id="qq" @click="First('pass')">二审通过(tahap pertama terlewati)</el-button>
           <el-button type="warning"  @click="dialogFormVisible = true">拒绝(tolak)</el-button>
          </div>
          <div v-else>
           <el-button type="success"  disabled>{{message}}</el-button>
          </div>
        </div>
       <dialogEE v-bind:dialogVisible="dialogVisible" ></dialogEE>
       <verifyPermission></verifyPermission>


        <el-dialog title="请选择拒绝原因" :visible.sync="dialogFormVisible" style="margin-left:50px;">
            <div v-for="city in refuseReason" :label="city.bigItem" :key="city.bigItem">
                <span> {{city.bigItem}}</span>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="item in city.smallItem" :label="city.bigItem+':'+item" :key="item">
                        {{item}}
                    </el-checkbox>
                </el-checkbox-group>
        
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="First('refuse')">提交(Kirim)</el-button>
            </div>
        </el-dialog>
       
    </div>
</template>

<script>
  import dialogEE from './Dialog.vue';
  import verifyPermission from './Permission.vue';
    export default {
        data() {
            return {
                // url:"http://172.20.14.33:8080/backend/IListingService/getPendAuditListingList",
                // personurl:"http://172.20.14.33:8080/backend/IListingService/getPendAuditDetail",
                // VerifyKTPurl:"http://172.20.14.33:8080/backend/IUserAuthService/submitKtpAuditInfo",
                // VerifyBankurl:"http://172.20.14.33:8080/backend/IUserAuthService/submitBankCardAuditInfo",
                // FirstListing:"http://172.20.14.33:8080/backend/IListingService/submitListingAuditInfo",
                // Infourl: "http://172.20.14.33:8080/backend/IListingAuditFlowLogService/getAudDetailDynaConfInfo",
                // submitinfo: "http://172.20.14.33:8080/backend/IListingAuditFlowLogService/submitListingAuditFlowLog",
                url:"/backend/IListingService/getPendAuditListingList",
                personurl:"/backend/IListingService/getPendAuditDetail",
                VerifyKTPurl:"/backend/IUserAuthService/submitKtpAuditInfo",
                VerifyBankurl:"/backend/IUserAuthService/submitBankCardAuditInfo",
                FirstListing:"/backend/IListingService/submitListingAuditInfo",
                Infourl:"/backend/IListingAuditFlowLogService/getAudDetailDynaConfInfo",
                submitinfo: "/backend/IListingAuditFlowLogService/submitListingAuditFlowLog",
                url6:"/backend/IUserAuthService/queryLiveDetect",
                active:true,
                dialogVisible: false, 
                listingStatus:"",
                UserMessage:[],
                 userId:'',
                tableData: [{
                    Dataitem: 'KTP',
                    ktpPhotoUrl: '',
                    ktpSelfPhotoUrl: ''
                }, {
                    Dataitem: '银行卡(kartu bank)',
                    ktpPhotoUrl: '',
                    ktpSelfPhotoUrl: ''
                }],
                  ruleForm: {
                    value1: '',
                    value2: '',
                },
                answerResult: [],
                answerPeople: [],
                refuseReason: [],
                SmallItem: [],
                checkList: [],
                dialogFormVisible: false,
                  detectFlag:'',
                liveDetectPhotoUrl:''
               
            }
        },
        components: {
			    'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,
        },
        created(){

              var listingId=this.$route.query.listingId;
                    
              this.queryPersonData(listingId);
                this.queryInfo();
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
          queryInfo() {
                let self = this;
                self.$axios.post(self.Infourl).then((res) => {
                    if (res.data.result == 0) {
                        self.answerResult = res.data.content.answerResult;
                        self.answerPeople = res.data.content.answerPeople;
                        self.refuseReason = res.data.content.refuseReason;
                        //   for(let i=0;i< self.refuseReason.length; i++){
                        //       for(let j=0;j< self.refuseReason[i].smallItem.length;j++){
                        //           console.log(self.refuseReason[i].bigItem+":"+self.refuseReason[i].smallItem[j])
                        //       }
                        //   }
                    }
                }).catch(function (err) {
                    console.log("调用失败", err)
                })
            },
            submitData(type) {
                let self = this;
                let userId = self.userId;
                let listingId = self.$route.query.listingId; 
                let auditName  = localStorage.getItem('ms_username');
                let operate;
                 let auditContent;
              
                if(type== 'phone'){
                     operate = 1;
                    auditContent = "接听人员(Petugas penjawab):" + self.ruleForm.value1 + ",接听状态(Status):" + self.ruleForm.value2;
                }else if(type=='firstpass'){
                     operate = 4;
                    auditContent="二审通过(Audit pertama terlewati)";
                }else if(type=='firstrefuse'){
                     operate = 5;
                    //  console.log(self.checkList);
                    // if(self.checkList.length==0 || self.checkList==null){
                    //     self.$message.error("请选择Pilih!");
                    //     return false;
                    // }
                     let Lengthcheck=self.checkList.length;
                     let str;
                     for(let k=0;k<Lengthcheck;k++){
                         if(k==0){
                            str= self.checkList[0];
                         }else{
                             str= str+";"+ self.checkList[k];
                         }
                     }
                    
                    auditContent = "审核拒绝(Penolakan audit),理由(Penyebab)"+str;
                }
                

                self.$axios.post(self.submitinfo, { "userId":userId,"listingId":listingId, "auditName": auditName, "operate": operate,"auditContent": auditContent }).then((res) => {

                    if (res.data.result == 0) {
                        self.$message.success("提交成功");
                        self.ruleForm.value1 = '';
                        self.ruleForm.value2 = '';
                        self.checkList=[];
                        self.dialogFormVisible=false;

                    } else if (res.data.result == '-99' || res.data.result == '-999') {
                        self.$message.error(res.data.resultMessage);
                    } else {
                        self.$message.error(res.data.resultMessage);
                    }


                })
            },  

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let self = this;
                        if (self.ruleForm.value1 == '' || self.ruleForm.value1 == null) {
                            self.$message.error("联系人不能为空Kenalan tidak boleh kosong");
                            return false;
                        }
                        if (self.ruleForm.value2 == '' || self.ruleForm.value2 == null) {
                            self.$message.error("联系状态不能为空Status kontak tidak boleh kosong");
                            return false;
                        } 

                        this.submitData('phone');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1)+(this.cur_page-1)*20;
           },
           handleSizeChange(val) {

            console.log(`每页 ${val} 条`);
          },
           ClickImg(imgURL,row){

            //  let routeData = this.$router.resolve({ path: 'imgdeal', query: { url: imgURL,KTPname:row.ktpName,KTPNO:row.ktpNo}});
            //  window.open(routeData.href, '_blank');  

             let KTPname=row.ktpName;
             let KTPNO=row.ktpNo;
             let img=imgURL;
             let imgSRC="//indonesia-object.oss-ap-southeast-5.aliyuncs.com/ktpDeal/imgdeal.html?KTPname="+KTPname+"&KTPNO="+KTPNO+"&imgurl="+img;
             window.open( imgSRC, '_blank'); 

            },
            ClickImglive(){
               let self = this;
               let KTPname=null;
               let KTPNO=null;
               let img=self.liveDetectPhotoUrl;
               if(img=='' || img==null){
                      self.$message.error("照片为空！");
                      return false;
               }
               let imgSRC="//indonesia-object.oss-ap-southeast-5.aliyuncs.com/ktpDeal/imgdeal.html?KTPname="+KTPname+"&KTPNO="+KTPNO+"&imgurl="+img;
               window.open( imgSRC, '_blank'); 
            },
            handleCurrentChange(val){
                this.cur_page = val;
                // this.queryData();
            },
            First(msg){
                  let self = this;
                 var listingId=self.$route.query.listingId;
                 var userId=self.userId;

              if(msg=="pass"){
                  self.submitData('firstpass');
                 self.$axios.post(self.FirstListing, {"userId":userId,"listingId":listingId,"auditStatus":2}).then((res) => {
                        if(res.data.result==0){                         
                            this.active=false;
                            this.message="审核通过(Verivikasi Terlewati)";
                             self.message=self.listingStatus;
                            this.$message.success('审核通过(Verivikasi Terlewati)');
                        }else{
                            this.$message.error(res.data.resultMessage);
                        }
                        
                    }).catch(function(err){
                    console.log("调用失败",err)
                    })
              }else if(msg=="refuse"){
                  if (self.checkList.length == 0) {
                      this.$message.error("请选择Pilih拒绝原因！");
                      return false;
                  }
                self.submitData('firstrefuse');
                   self.$axios.post(self.FirstListing, {"userId":userId,"listingId":listingId,"auditStatus":0}).then((res) => {
                        if(res.data.result==0){                         
                            this.active=false;
                            this.message="审核拒绝(tolak)";
                            this.$message.success('审核拒绝(tolak)');
                        }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                        }else{
                            self.$message.error(res.data.resultMessage);
                        }
                                
                    }).catch(function(err){
                    console.log("调用失败",err)
                    })
              }
            },
            queryPersonData(listingId){
                   let self = this;
                    self.UserMessage=Array();
                   
                    var statusName;
                   self.$axios.post(self.personurl, {"listingId":listingId}).then((res) => {
                      
                   let Length=res.data.content.length;
                   
                   for(let i=0; i< Length; i++){

                       if(res.data.content[i].listingInfo !=null){
                            var listingid=res.data.content[i].listingInfo.id;
                            var amount=res.data.content[i].listingInfo.amount;
                            var status=res.data.content[i].listingInfo.status;
                            var periodNo=res.data.content[i].listingInfo.termQuantity;//换成termQuantity
                            var termUnit=res.data.content[i].listingInfo.termUnit;
                            var listingStatus=res.data.content[i].listingInfo.status;
                            self.userId=res.data.content[i].listingInfo.borrowerId;
                       }
                      
                      if(res.data.content[i].ktpInfo !=null){
                        var ktpName=res.data.content[i].ktpInfo.ktpName;
                        var ktpNo=res.data.content[i].ktpInfo.ktpNumber;
                        var ktpPhotoUrl=res.data.content[i].ktpInfo.ktpPhotoUrl;
                        var ktpSelfPhotoUrl=res.data.content[i].ktpInfo.ktpSelfPhotoUrl;
                        var ktpStatus=res.data.content[i].ktpInfo.auditResultStatus;
                      }

                    if(res.data.content[i].bankCardInfo !=null){
                      var bankName=res.data.content[i].bankCardInfo.bankName;
                      var bankCardNo=res.data.content[i].bankCardInfo.bankCardNo;
                      var ownerName=res.data.content[i].bankCardInfo.ownerName;
                      var receptionHolderName=res.data.content[i].bankCardInfo.receptionHolderName;
                      var bankid=res.data.content[i].bankCardInfo.id;
                      var bankStatus=res.data.content[i].bankCardInfo.auditResultStatus;
                      var bankCode=res.data.content[i].bankCardInfo.bankCode;
                      var bankCardInfoStatus=res.data.content[i].bankCardInfo.status;
                      }
                    
                       self. tableData= [{  //重新加载使用
                            Dataitem: 'KTP',
                            ktpPhotoUrl: '',
                            ktpSelfPhotoUrl: ''
                        }, {
                            Dataitem: '银行卡(kartu bank)',
                            ktpPhotoUrl: '',
                            ktpSelfPhotoUrl: ''
                        }]
                     
                                
                        self.UserMessage.push({
                              "userId":self.userId,
                               "id":listingId,
                               "bankid":bankid,
                               "amount":amount,
                               "status":status,
                               "periodNo":periodNo,
                               "termUnit":termUnit,
                               "ktpName":ktpName,
                               "ktpNo":ktpNo,
                               "ktpPhotoUrl":ktpPhotoUrl,
                               "ktpSelfPhotoUrl":ktpSelfPhotoUrl,
                               "bankName":bankName,  
                               "bankCardNo":bankCardNo,
                               "ownerName":ownerName,
                               "receptionHolderName":receptionHolderName,
                               "listingStatus":listingStatus,
                               "ktpStatus":ktpStatus,
                               "bankStatus":bankStatus,
                               "bankCode":bankCode,
                               "bankCardInfoStatus":bankCardInfoStatus
                        });                    
                   }
                    
                      self.queryLiveDetect(self.userId);
                    this.tableData[0].ktpPhotoUrl=self.UserMessage[0].ktpPhotoUrl;
                    this.tableData[0].ktpSelfPhotoUrl=self.UserMessage[0].ktpSelfPhotoUrl;
                    this.tableData[0].userId=self.UserMessage[0].userId;
                    this.tableData[0].ktpNo=self.UserMessage[0].ktpNo;
                    this.tableData[0].ktpName=self.UserMessage[0].ktpName;
                    self.listingStatus=this.CheckCode("listing",self.UserMessage[0].listingStatus);
                 
                    var ketStatus=this.CheckCode("bankORkpt",self.UserMessage[0].ktpStatus);
                    this.tableData[0].status=ketStatus;
                    this.tableData[1].userId=self.UserMessage[0].userId;
                    this.tableData[1].bankName=self.UserMessage[0].bankName;
                    this.tableData[1].bankCardNo=self.UserMessage[0].bankCardNo;
                    this.tableData[1].ownerName=self.UserMessage[0].ownerName;
                    this.tableData[1].receptionHolderName=self.UserMessage[0].receptionHolderName;
                    this.tableData[1].id=self.UserMessage[0].id;
                    this.tableData[1].bankid=self.UserMessage[0].bankid;
                    this.tableData[1].bankCode=self.UserMessage[0].bankCode;               
                    var bankStatus=this.CheckCode("bankORkpt",self.UserMessage[0].bankStatus);
                    this.tableData[1].status=bankStatus;
                    this.tableData[1].BCFstatus=self.UserMessage[0].bankCardInfoStatus;
                    
              })

            },
            queryLiveDetect(userId){
                let self = this;          
                self.$axios.post(self.url6, { "userId": userId }).then((res) => {

                    if (res.data.result == 0) {
                        let detectFlagR= res.data.content.detectFlag;
                        if(detectFlagR===true){
                           self.detectFlag ="成功(Sukses)";
                           self.liveDetectPhotoUrl = res.data.content.liveDetectPhotoUrl;
                        }else if(detectFlagR === false){
                            self.detectFlag = "失败(Gagal)";
                        }else{
                            self.detectFlag = "无";
                        }
                                   
                    } else if (res.data.result == '-99' || res.data.result == '-999') {
                        self.$message.error(res.data.resultMessage);
                    } else {
                        self.$message.error(res.data.resultMessage);
                    }

                })

            },
            index(row, column){
                return row.index;
            },
            CheckCode(content,type){
              var statusName;
             if(content=="listing"){
                if(type==10 || type==20){
                         statusName="待1st审核";
                }else if(type==30){
                    statusName="待2nd审核";
                }
                return statusName;
             }

            if(content=="bankORkpt"){
                if(type==0){
                    statusName="通过 (terlewati)";
                }else if(type==1){
                    statusName="待审核(menunggu verifikasi)";
                }else if(type==-1){
                    statusName="拒绝 （tolak）";
                }
                return statusName;
             }
                
            },
            Verify(index,row){
               let self = this;
               var userId=self.userId;
               var ktpNo=row.ktpNo;
               var ktpName=row.ktpName;

               //bank
               var bankCardNo=row.bankCardNo;
               var bankName=row.bankName;
               var ownerName=row.ownerName;
                var bankCode=row.bankCode;
               var receptionHolderName=row.receptionHolderName;
                let id=row.bankid;
         
               if(index==0){
                  
                    self.$axios.post(self.VerifyKTPurl, {"userId":userId,"ktpNo":ktpNo,"ktpName":ktpName,"auditStatus":0}).then((res) => {
                        if(res.data.result==0){
                            
                            this.$message.success('通过 (terlewati)');
                            this.Reload();
                        }
                        
                    }).catch(function(err){
                    console.log("调用失败",err)
                    })
               }
                if(index==1){
                           
                   self.$axios.post(self.VerifyBankurl, {"id":id,"userId":userId,"bankCardNo":bankCardNo,"bankCode":bankCode,"bankName":bankName,"ownerName":ownerName,"receptionHolderName":receptionHolderName,"auditStatus":0}).then((res) => {
                        if(res.data.result==0){
                        this.$message.success('通过 (terlewati)');
                        }
                          this.Reload();
                        
                    }).catch(function(err){
                    console.log("调用失败",err)
                    })
               }
              
              

            },
             Refuse(index,row){
               let self = this;
               let userId=self.userId;
               let ktpNo=row.ktpNo;
               let ktpName=row.ktpName;

               let bankCardNo=row.bankCardNo;
               let bankName=row.bankName;
               var bankCode=row.bankCode;
               let ownerName=row.ownerName;
               let receptionHolderName=row.receptionHolderName;
               let id=row.bankid;
                

              if(index==0){
                  
                    self.$axios.post(self.VerifyKTPurl, {"userId":userId,"ktpNo":ktpNo,"ktpName":ktpName,"auditStatus":-1}).then((res) => {
                       
                        if(res.data.result==0){
                          this.$message.success('拒绝(tolak)');
                        }
                          this.Reload();
                                        
                    }).catch(function(err){
                      console.log("调用失败",err)
                    })
                    
              }else if(index==1){
                   self.$axios.post(self.VerifyBankurl, {"id":id,"userId":userId,"bankCardNo":bankCardNo,"bankCode":bankCode,"bankName":bankName,"ownerName":ownerName,"receptionHolderName":receptionHolderName,"auditStatus":-1}).then((res) => {
                        if(res.data.result==0){
                        this.$message.success('拒绝(tolak)');
                        }
                          this.Reload();
                        
                    }).catch(function(err){
                      console.log("调用失败",err)
                    })
              }
              

            },
            Reload(){
              var listingId=this.$route.query.listingId;
              
              this.queryPersonData(listingId);
            }
        }
    }
</script>

<style scoped>

 hr{
height:1px;
border:none;
border-top:1px solid  #555555;
margin:5px 0;
opacity:0.5;
} 
.first{
    margin-top: 50px;
}
.check{
    margin-bottom: 50px;
}
.ktpInfo{
    line-height: 20px;
        /* display: flex;
        justify-content:space-evenly; */
}
.ktpInfo img{
    width: 100px;
    height: 100px;
}
.Order{
    display: flex;
   justify-content: space-between;
}
.text{
    vertical-align: middle;
    font-size: 15px;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
}


</style>
