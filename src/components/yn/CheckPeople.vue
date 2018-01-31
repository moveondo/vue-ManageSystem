<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>审核(Verifikasi)</el-breadcrumb-item>
                <el-breadcrumb-item>个人资料(Susunan verifikasi pertama)</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">     
           <el-select v-model="region" placeholder="请选择">
                        <el-option key="bbk" label="用户ID(ID pengguna)" value="1"></el-option>
                        <el-option key="xtc" label="电话号码(phone number)" value="2"></el-option>
           </el-select>
         <el-input v-model="userIdORphone"  placeholder="不可为空"  class="handle-input mr10"></el-input>
         <el-button type="primary" icon="search" @click="search">搜索(Mencari)</el-button>
        </div>

        <div class="presonMessage">
          <div class="title text">基础信息 (Informasi dasar)</div>  
          <div class="Order">
                <div class="text">userId: {{basics.userId}} </div>
                <div class="text">mobile: {{basics.mobile}} </div>
          </div>
          <hr />
          <div class="ktpInfo" :model="ktpInfo" >
              <div class="Order">
                <div class="text">ktpName: {{ktpInfo.ktpName}} </div>
                <div class="text">ktpNumber: {{ktpInfo.ktpNumber}} </div>
              </div>
            <div class="Order">
             <div class="text">KTP正面照: <img v-bind:src="ktpInfo.ktpPhotoUrl"/> </div>
             <div class="text">ktpSelfPhotoUrl: <img v-bind:src="ktpInfo.ktpSelfPhotoUrl"/></div>
            </div>
            <div class="Order">
             <div  class="text">KTP认证状态 (status sah KTP):{{ktpInfo.AuthState}}
                 <span class="status" v-if="ktpInfo.authState=='1' || ktpInfo.authState=='-1' ">
                     <el-button type="success"   @click="CheckStatus('ktp')">{{message}}</el-button>
                </span>
             </div>
            </div>
          </div>
          <hr/>
           <div class="ktpInfo" :model="personalInfo" >
               <div class="Order">
             <div class="text">婚姻状况 (status pernikahan):{{personalInfo.maritalStatus}} </div>
             <div class="text">借款目的 (tujuan meminjam): {{personalInfo.loanPurpose}} </div>
              </div>
               <div class="Order">
             <div class="text">出生日期: {{personalInfo.bornDate}} </div>
            
             <div class="text">宗教 (agama): {{personalInfo.religion}}</div>
                </div>
               <div class="Order">
             <div class="text">教育程度 (tingkat pendidikan): {{personalInfo.educationLevel}} </div>
             <div class="text">省: {{personalInfo.province}}</div>
               </div>
               <div class="Order">
             <div class="text">市: {{personalInfo.city}}</div>
             <div class="text">区: {{personalInfo.area}}</div>
                </div>
               <div class="Order">
             <div class="text"> 住宅地址 (alamat tempat tinggal) (alamat tempat tinggal): {{personalInfo.address}}</div>
               </div>
          </div>
           <hr/>
           <div class="ktpInfo" :model="workInfo" >
                <div class="Order">
              <div class="text">行职业 (bidang pekerjaan): {{workInfo.industry}}</div>
              <div class="text">公司地址 (alamat perusahaan): {{workInfo.workAddress}}</div>
                </div>
               <div class="Order">
             <div class="text">公司名称 (nama perusahaan):{{workInfo.companyName}} </div>
             <div class="text">工作职位: {{workInfo.workPosition}} </div>
                </div>
                
               <div class="Order">
             <div class="text">公司电话 (nomor telepon perusahaan): {{workInfo.companyTel}} </div>
              <div class="text"> 工作年限 (lama bekerja): {{workInfo.workAge}}</div>          
               </div>
               <div class="Order">
             <div class="text">月收入 (pendapatan perbulan): {{workInfo.monthlyIncome}} </div>        
               </div>
          </div>
            <hr/>
           <div class="ktpInfo" :model="emergencyContact" >
               <div class="Order">
             <div class="text">联系人1姓名（nama): {{emergencyContact.contactName1}} </div>
             <div class="text">联系人1手机号(nomor ponsel): {{emergencyContact.contactMobile1}} </div>
               </div>
               <div class="Order">
             <div class="text">关系1(hubungan1): {{emergencyContact.relation1}} </div>
             
             <div class="text">二联 (kontak ke 2): {{emergencyContact.contactName2}}</div>
               </div>
               <div class="Order">
             <div class="text">联系人2手机号(nomor ponsel): {{emergencyContact.contactMobile2}} </div>
             <div class="text">关系2 (hubungan2): {{emergencyContact.relation2}}</div>
               </div>
          </div>
             <hr/>
           <div class="ktpInfo" :model="bankInfo" >
               <div class="Order">
             <div class="text">银行code: {{bankInfo.bankCode}} </div>
             <div class="text">所属银行 (bank): {{bankInfo.bankName}} </div>
               </div>
               <div class="Order">
             <div class="text">银行账号 (nomor akun bank): {{bankInfo.bankNum}}</div>
             <div class="text">开户姓名 (nama pembuka akun bank): {{bankInfo.holder}} </div>
               </div>
                <div class="Order">
            <div  class="text">银行认证状态 (status sah bank):{{bankInfo.bankStatus}}
                <span class="status" v-if=" bankInfo.status=='-1' || bankInfo.status=='1'  ">
                    <el-button type="success"   @click="CheckStatus('bank')">{{bankmessage}}</el-button>
                </span>
            </div>
                </div>
          </div>

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
                // url:"http://172.20.14.33:8086/backend/IUserAuthService/getUserDetailInfo",
                // url2:"http://172.20.14.33:8086/backend/IUserAuthService/getUserDictionary",
                // url1:"/api/backend/IThirdAuthService/ktpAuth",
                // url3:"http://172.20.14.33:8086/backend/IUserAuthService/queryBankCardVerifyInfo",
                url:"/backend/IUserAuthService/getUserDetailInfo",
                url2:"/backend/IUserAuthService/getUserDictionary",
                url1:"/backend/IThirdAuthService/ktpAuth",
                url3:"/backend/IUserAuthService/queryBankCardVerifyInfo",
                userIdORphone:'',
                region:'',
                is_search:false,
                dialogVisible: false,
                message:"点击认证(klik mensahkan)",
                bankmessage:"更新状态(update status)",
                basics:{
                  userId:'',
                  mobile:''
                },    
                ktpInfo: {
                    ktpName:'',
                    ktpNumber:'',
                    ktpPhotoUrl:'',
                    ktpSelfPhotoUrl:'',
                    authState:'',
                    AuthState:''
                },
                personalInfo:{
                    maritalStatus:'',
                    loanPurpose:'',
                    bornDate:'',
                    religion:'',
                    educationLevel:'',
                    province:'',
                    city:'',
                    area:'',
                    address:"",
                },
                workInfo:{
                    companyName:'',
                    workPosition:'',
                    companyTel:'',
                    workAddress:'',
                    monthlyIncome:'',
                    workAge:'',
                    industry:''
                },
                emergencyContact:{
                    contactName1:'',
                    contactMobile1:'',
                    relation1:'',
                    contactName2:'',
                    contactMobile2:'',
                    relation2:''
                },
                bankInfo:{
                    bankCode:'',
                    bankName:'',
                    bankNum:'',
                    holder:'',
                    status:''
                },
                marriedList:Array(),
                industryList:Array(),
                eduList:Array(),
                religionList:Array(),
                loanUseList:Array(),
                workAgeList:Array(),
                relationShipList:Array(),

                         
            }
        },
        components: {
			    'dialogEE':dialogEE,  
            'verifyPermission':verifyPermission,
        },
        created(){
        this.GetUserDictionary();

            let userId=this.$route.query.userId;
            if(userId){
              this.GetUserDictionary();
              let mobile="";
               this.queryData(userId,mobile);
            }
           
        },
    
        methods: {
         
            queryData(userId,mobile){
                let self = this;
                self.$axios.post(self.url, {"userId":userId,"mobile":mobile}).then((res) => {

                    if(res.data.result==0){

                        self.basics.userId=res.data.content.userId;
                        self.basics.mobile=res.data.content.mobile;
                    
                    
                    if(res.data.content.personalInfo !=null){
                                       
                     if(res.data.content.personalInfo.address !=null){
                       self.personalInfo.address = res.data.content.personalInfo.address;
                      }
                    
                     self.personalInfo.maritalStatus=self.marriedList[res.data.content.personalInfo.maritalStatus];
                                    
                     self.personalInfo.area = res.data.content.personalInfo.area;
                     self.personalInfo.loanPurpose =self.loanUseList[res.data.content.personalInfo.loanPurpose];
                     self.personalInfo.bornDate = res.data.content.personalInfo.bornDate;
                     self.personalInfo.religion =self.religionList[res.data.content.personalInfo.religion];


                     self.personalInfo.educationLevel =self.eduList[res.data.content.personalInfo.educationLevel];
                     self.personalInfo.province = res.data.content.personalInfo.province;
                     self.personalInfo.city = res.data.content.personalInfo.city;
                     self.personalInfo.area = res.data.content.personalInfo.area;

                    }else{
                          self.personalInfo.address = "";
                           self.personalInfo.maritalStatus='';                                
                            self.personalInfo.area ='';   
                            self.personalInfo.loanPurpose ='';   
                            self.personalInfo.bornDate = '';   
                            self.personalInfo.religion ='';   
                            self.personalInfo.educationLevel ='';   
                            self.personalInfo.province = '';   
                            self.personalInfo.city = '';   
                            self.personalInfo.area = '';   
                    }
                   
                    if(res.data.content.ktpInfo !==null){
                      self.ktpInfo.ktpName = res.data.content.ktpInfo.ktpName;
                      self.ktpInfo.ktpNumber = res.data.content.ktpInfo.ktpNumber;
                      self.ktpInfo.ktpPhotoUrl = res.data.content.ktpInfo.ktpPhotoUrl;
                      self.ktpInfo.ktpSelfPhotoUrl = res.data.content.ktpInfo.ktpSelfPhotoUrl;
                        
                     if(res.data.content.ktpInfo.authState !==null){
                            
                       self.ktpInfo.authState=res.data.content.ktpInfo.authState;
                       
                       var AuthState=self.CheckCode(res.data.content.ktpInfo.authState);
                       self.ktpInfo.AuthState=AuthState;
                     }
                        
                    }else{
                          self.ktpInfo.ktpName = '';
                          self.ktpInfo.ktpNumber = '';
                         self.ktpInfo.ktpPhotoUrl = '';
                          self.ktpInfo.ktpSelfPhotoUrl = '';
                        self.ktpInfo.authState='';
                    }
                    
                     if(res.data.content.bankInfo !==null){
                      if(res.data.content.bankInfo.bankCode !== null){
                       self.bankInfo.bankCode = res.data.content.bankInfo.bankCode;
                      }                 
                        self.bankInfo.bankName = res.data.content.bankInfo.bankName;
                        self.bankInfo.bankNum = res.data.content.bankInfo.bankNum;
                        self.bankInfo.holder = res.data.content.bankInfo.holder;
                        self.bankInfo.status=res.data.content.bankInfo.status;
                        var bankS=self.CheckCode(res.data.content.bankInfo.status);
                        self.bankInfo.bankStatus=bankS;
                     }else{
                          self.bankInfo.bankCode ='';
                           self.bankInfo.bankName = '';
                           self.bankInfo.bankNum ='';
                          self.bankInfo.holder = '';
                            self.bankInfo.status='';
                     }
                   
                   if(res.data.content.emergencyContact !==null){
                     self.emergencyContact.contactMobile1 = res.data.content.emergencyContact.contactMobile1;
                     self.emergencyContact.contactMobile2 = res.data.content.emergencyContact.contactMobile2;
                     self.emergencyContact.contactName1 = res.data.content.emergencyContact.contactName1;
                     self.emergencyContact.contactName2 = res.data.content.emergencyContact.contactName2;
                     self.emergencyContact.relation1 =self.relationShipList[res.data.content.emergencyContact.relation1];
                     self.emergencyContact.relation2 =self.relationShipList[res.data.content.emergencyContact.relation2];
                   }else{
                         self.emergencyContact.contactMobile1 = '';
                         self.emergencyContact.contactMobile2 = '';
                        self.emergencyContact.contactName1 = '';
                        self.emergencyContact.contactName2 = '';
                        self.emergencyContact.relation1 ='';
                         self.emergencyContact.relation2 ='';
                   }
                   
                    if(res.data.content.workInfo !==null){
                     self.workInfo.companyName = res.data.content.workInfo.companyName;
                     self.workInfo.companyTel = res.data.content.workInfo.companyTel;
                     self.workInfo.industry =self.industryList[res.data.content.workInfo.industry];
                     self.workInfo.monthlyIncome = res.data.content.workInfo.monthlyIncome;
                     self.workInfo.workAddress = res.data.content.workInfo.workAddress;
                     self.workInfo.workAge =self.workAgeList[res.data.content.workInfo.workAge];
                     self.workInfo.workPosition = res.data.content.workInfo.workPosition;
                    }else{
                         self.workInfo.companyName = '';
                        self.workInfo.companyTel = '';
                        self.workInfo.industry ='';
                        self.workInfo.monthlyIncome = '';
                        self.workInfo.workAddress = '';
                        self.workInfo.workAge ='';
                        self.workInfo.workPosition ='';
                    }
                    
                     self.userId=userId;

                    }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                    }else{
                        self.$message.error(res.data.resultMessage);
                    }          

                })
            },
              search(){
                 this.is_search = true;
                 let userIdORphone=this.userIdORphone;
                 let region=this.region;
                 
              
                if(userIdORphone=='') {
                  this.$message.error('不能为空(userId tidak boleh kosong)！');
                  return false;
                }
                if(region==1){
                     var userId=this.userIdORphone;
                     var mobile="";
                 }
                if(region==2){
                     var mobile=this.userIdORphone;
                     var userId="";
                 }
               
                this.GetUserDictionary();
                this.queryData(userId,mobile);
            },
            CheckCode(type){
              var statusName;
          
                if(type==1){
                    statusName="待认证(Menunggu Mendapatkan Sertifikasi)";
                }else if(type==0){
                    statusName="认证成功(Sertifikasi sukses)";
                }else if(type=="-1"){
                   statusName="认证失败(Sertifikasi Gagal)";
                }
                return statusName;
                
            },
            CheckStatus(type){
                 let self = this;

                 let userId=self.userId;
                 var bankCardNo= self.bankInfo.bankNum;
                 var bankCode=self.bankInfo.bankCode;
                 var ownerName=self.bankInfo.bankName;
            
                 if(type=="bank"){
                      self.$axios.post(self.url3, {"userId":userId,"bankCardNo":bankCardNo,"bankCode":bankCode,"ownerName":ownerName}).then((res) => {
                        if(res.data.result==0 && res.data.content.status==0){ 
                            self.message="更新成功(update success)！" ;                                               
                            self.$message.success('更新成功(update success)！');
                        }else if(res.data.content.status=="-1"){
                            self.message="更新失败(update gagal)！" ;
                            self.$message.error('更新失败(update gagal)!'); 
                        }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                        }else{
                            self.$message.error(res.data.resultMessage);
                        }
                        
                    }).catch(function(err){
                    console.log("调用失败",err)
                    })
                 }
                 var KtpNo= self.ktpInfo.ktpNumber;
                 var ktpName=self.ktpInfo.ktpName;

                 if(type=="ktp"){
                       self.$axios.post(self.url1, {"userId":userId,"idNumber":KtpNo,"name":ktpName}).then((res) => {
                        if(res.data.result==0 && res.data.content==10){ 
                            self.message="认证成功(Sertifikasi sukses)！"                                              
                            self.$message.success('认证成功(Sertifikasi sukses)！');
                        }else if(res.data.content==11){
                             self.message="认证失败(Sertifikasi Gagal)！" ;
                            self.$message.error('认证失败(Sertifikasi Gagal)'); 

                        }else if(res.data.content==12){
                             self.message="认证异常(Sertifikasi Gagal)！" ;
                            self.$message.error('认证异常(Sertifikasi Gagal)'); 

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
            GetUserDictionary(){
                let self = this;
                  self.$axios.post(self.url2, {
                 headers: {"Accept-Language":"in",  }}).then((res) => {
                        if(res.data.result==0){ 

                      var ll=res.data.content.industryList.length;

                    for(let i=0;i<ll;i++){                  
                     self.industryList[res.data.content.industryList[i].code]=res.data.content.industryList[i].codeDesc; 
                    }
                    var llist=res.data.content.loanUseList.length;
                   for(let i=0;i<llist;i++){                  
                     self.loanUseList[res.data.content.loanUseList[i].code]=res.data.content.loanUseList[i].codeDesc; 
                    }
                     var mlist=res.data.content.marriedList.length;
                   for(let i=0;i<mlist;i++){                  
                     self.marriedList[res.data.content.marriedList[i].code]=res.data.content.marriedList[i].codeDesc; 
                    }
                     var Rlist=res.data.content.relationShipList.length;
                   for(let i=0;i<Rlist;i++){                  
                     self.relationShipList[res.data.content.relationShipList[i].code]=res.data.content.relationShipList[i].codeDesc; 
                    }
                     var relist=res.data.content.religionList.length;
                   for(let i=0;i<relist;i++){                  
                     self.religionList[res.data.content.religionList[i].code]=res.data.content.religionList[i].codeDesc; 
                    }

                      var wlist=res.data.content.workAgeList.length;
                    for(let i=0;i<wlist;i++){                  
                     self.workAgeList[res.data.content.workAgeList[i].code]=res.data.content.workAgeList[i].codeDesc; 
                     } 

                       var eduL=res.data.content.eduList.length;
                   for(let i=0;i<eduL;i++){                  
                     self.eduList[res.data.content.eduList[i].code]=res.data.content.eduList[i].codeDesc; 
                    }
                                       
                           
                        }else if( res.data.result=='-99' || res.data.result=='-999'){
                            self.$message.error(res.data.resultMessage);
                        }else{
                            self.$message.error(res.data.resultMessage);
                        }
                        
                    }).catch(function(err){
                    console.log("调用失败",err)
                    })
            }
        
           
           
         
        }
    }
</script>

<style scoped>
.handle-input{
    width: 150px;
    display: inline-block;
}
.presonMessage{
    width: 860px;
    margin:10px 0;
}
hr{
height:2px;
border:none;
border-top:1px solid  #555555;
margin:10px 0;
opacity:0.5;
} 
.status{
    margin-left: 50px;
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
