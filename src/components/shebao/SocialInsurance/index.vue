<template lang="html">
  <div class="">

   <div v-if="type === 'A'">
      <div class="pop">
        {{current}}
      </div>
   </div>
   <div v-else-if="type === 'B'" class="SocialInsurance">
     <div class="content" :class="{iphonex:isiphonex}">
       <div class="header" :class="{xheader:isiphonex}">
         <div class="arror">
           <img :src="ic_back"  @click="back()" >
         </div>
         <div class="owner" @click="owner()">
           <img :src="ic_main" >
         </div>
       </div>
       <div class="title">累计缴纳</div>
       <div class="num">{{ howmuch}}个月</div>
       <div class="update" @click="update()">  更新 </div>
       <div class="updatetime">更新时间：{{ updatetime  | formatDate}}</div>
     </div>
     <div class="get-detail" :class="{xdetail:isiphonex}">
       <div class="account">账户信息</div>
       <hr style="border: 0.5px solid #E6E6E6; width: 100%;">
       <div class="desc">
         <div class="name">姓名:<span class="color-type">{{name}}</span> </div>
         <div class="id" v-if="id">身份证号:<span class="color-type">{{id}} </span></div>
         <div class="where" v-if="where">当前缴存企业:<span class="color-type"> {{where}} </span></div>
       </div>
       <div class="divide"></div>
       <div class="account-1">缴存明细 {{frameDate}}</div>
       <hr style="border: 0.5px solid #E6E6E6; width: 100%;">
       <div class="Accountdetail"  >
         <table class="table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <td>项目</td>
                    <td>缴纳日期</td>
                    <td>缴纳基数</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{{"养老"}}</td>
                  <td v-if="insuredDate1">{{insuredDate1  | formatDate }}</td>
                  <td v-else>{{'--' }}</td>
                  <td  v-if="depositBase1 > 0" @click="GetDetail(1)">{{depositBase1 +'  >'}}</td>
                  <td v-else>{{'--' }}</td>
                </tr>
                <tr>
                  <td>{{"失业"}}</td>
                  <td v-if="insuredDate2">{{insuredDate2  | formatDate }}</td>
                  <td v-else>{{'--' }}</td>
                  <td  v-if="depositBase2 > 0" @click="GetDetail(4)">{{depositBase2 +'  >'}}</td>
                  <td v-else>{{'--' }}</td>
                </tr>
                <tr>
                  <td>{{"工伤"}}</td>
                  <td v-if="insuredDate3">{{insuredDate3  | formatDate }}</td>
                  <td v-else>{{'--' }}</td>
                  <td  v-if="depositBase3 > 0" @click="GetDetail(3)">{{depositBase3 +'  >'}}</td>
                  <td v-else>{{'--' }}</td>
                </tr>
                <tr>
                  <td>{{"生育"}}</td>
                  <td v-if="insuredDate4">{{insuredDate4  | formatDate }}</td>
                  <td v-else>{{'--' }}</td>
                  <td  v-if="depositBase4 > 0" @click="GetDetail(5)">{{depositBase4 +'  >'}}</td>
                  <td v-else>{{'--' }}</td>
                </tr>
                <tr>
                  <td>{{"医疗"}}</td>
                  <td v-if="insuredDate5">{{insuredDate5  | formatDate }}</td>
                  <td v-else>{{'--' }}</td>
                  <td  v-if="depositBase5 > 0" @click="GetDetail(2)">{{depositBase5 +'  >'}}</td>
                  <td v-else>{{'--' }}</td>
                </tr>
            </tbody>
        </table>
       </div>
     </div>
  </div>
  </div>
</template>
<script>
import ic_back from '../../common/icons/ic_back.png';
import ic_main from '../../common/icons/main.png';
import {formatDate} from '../../common/js/date.js' ;
import sensorsData from '../../common/js/sensorsData.js'
import {doSensors} from '../../common/js/sensorsEvent.js';
export default {
  data () {
    return {
      // url0:"/thirdUser/IThirdUserService/checkProcessStatus",
       //url:"http://172.20.14.24:8082/creditApi/ICreditReportService/socialSecurityReportInfo",
      // url2:"/thirdUser/IThirdUserService/getInvokeInfo.htm",
      url0:"/thirdUser/IThirdUserService/checkProcessStatus",
      url:"/creditApi/ICreditReportService/socialSecurityReportInfo",
      url2:"/thirdUser/IThirdUserService/getInvokeInfo.htm",
      type:'C',
      current:'等待中...',
      frameDate:'',
      ic_back:ic_back,
      ic_main:ic_main,
      howmuch:'',
      updatetime:"2018-05-01",
      name:'',
      id:'',
      where:'',
      reportId:'',
      insuredDate1:'',
      depositBase1:'',
      insuredDate2:'',
      depositBase2:'',
      insuredDate3:'',
      depositBase3:'',
      insuredDate4:'',
      depositBase4:'',
      insuredDate5:'',
      depositBase5:'',
      accountNum:'',
      isiphonex:false
    }
  },
  filters: {
    formatDate(time) {
        var date = new Date(time);
        return formatDate(date, "yyyy-MM-dd");
    }
  },
  created() {
    let self=this;
    let IPhonex=self.isIphoneX();
    if(IPhonex){
      self.isiphonex=true;
    }

    self.axios.post(self.url0,{reportSourceType:5}).then(res => {

          if(res.data.result==0 && res.data.content.showFail==true){

              self.type='A';
              self.current="获取报告失败.....";
          }else if(res.data.result==0 && res.data.content.hasHistory==true){

            self.type='B';
            let isiOS = navigator.userAgent.match('iPad')
                       || navigator.userAgent.match('iPhone')
                       || navigator.userAgent.match('iPod');
            if(isiOS){
              window.webkit.messageHandlers.hideNav.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
            }else{
              window.JsNutCredit.hideNav();
            }
            self.getStatus();
         }else if(res.data.result==0 && res.data.content.hasHistory==false){

              self.getinfo();
          }
        })
  },
  methods: {
    getStatus(){
       let self=this;
        let reportId=self.$route.query.reportId;
       self.axios.post(self.url,{reportId:reportId})
          .then(res => {
             if(res.data.result==0){
               self.name=res.data.content.realName;
               self.id=res.data.content.cardId;
               self.where=res.data.content.companyName;
               self.howmuch=res.data.content.handMonthCount;
               self.updatetime=res.data.content.refreshtime;
               self.reportId=res.data.content.reportId;
               self.frameDate=res.data.content.frameDate;
               self.accountNum=res.data.content.accountNum;
               if(res.data.content.endowmentInsuranceBaseInfo.insuredDate){
                 self.insuredDate1=res.data.content.endowmentInsuranceBaseInfo.insuredDate;
                 self.depositBase1=res.data.content.endowmentInsuranceBaseInfo.depositBase;
               }
               if(res.data.content.unemploymentInsuranceBaseInfo.insuredDate){
                 self.insuredDate2=res.data.content.unemploymentInsuranceBaseInfo.insuredDate;
                 self.depositBase2=res.data.content.unemploymentInsuranceBaseInfo.depositBase;
               }
               if(res.data.content.employmentInsuranceBaseInfo.insuredDate){
                 self.insuredDate3=res.data.content.employmentInsuranceBaseInfo.insuredDate;
                 self.depositBase3=res.data.content.employmentInsuranceBaseInfo.depositBase;
               }
               if(res.data.content.maternityInsuranceBaseInfo.insuredDate){
                 self.insuredDate4=res.data.content.maternityInsuranceBaseInfo.insuredDate;
                 self.depositBase4=res.data.content.maternityInsuranceBaseInfo.depositBase;
               }
               if(res.data.content.medicalInsuranceBaseInfo.insuredDate){

                 self.insuredDate5=res.data.content.medicalInsuranceBaseInfo.insuredDate;
                 self.depositBase5=res.data.content.medicalInsuranceBaseInfo.depositBase;
               }

             }
          })
    },
    getinfo(){

      let self=this;
      let isiOS = navigator.userAgent.match('iPad')
                 || navigator.userAgent.match('iPhone')
                 || navigator.userAgent.match('iPod');
      let isAndroid  = navigator.userAgent.match('Android');
      let clientType;
      if(isiOS){
        clientType=6;
      }else if(isAndroid){
        clientType=7;
      }else{
        clientType=5;
      }
     self.axios.post(self.url2,{"reportSourceType":5,"clientType":clientType}).then(res => {
           if(res.data.result==0){
             let Url=res.data.content.actionUrl;
             if(Url){
                window.location.href=Url;
             }
           }
      })

    },
    GetDetail(type){
      let self=this;
      self.$router.push({ path: '/SocialDetail', query: { "type":type,"reportId":self.reportId}});
    },
    update(){
        let self=this;
          doSensors(self.getSensorData("社保更新").sensorsData);
        let isiOS = navigator.userAgent.match('iPad')
                   || navigator.userAgent.match('iPhone')
                   || navigator.userAgent.match('iPod');
       if(isiOS){

         window.webkit.messageHandlers.showNav.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
       }else{
         window.JsNutCredit.showNav();
       }
         self.getinfo();
    },
    owner(){
      let self=this;
        doSensors(self.getSensorData("社保跳转").sensorsData);
      self.$router.push({ path: 'Account', query: { type:'shebao',accountNum:self.accountNum}});
    },
    isIphoneX(){
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    },
    back(){
      //this.$router.go(-1);
      let isiOS = navigator.userAgent.match('iPad')
                 || navigator.userAgent.match('iPhone')
                 || navigator.userAgent.match('iPod');
      if(isiOS){
        window.webkit.messageHandlers.close.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
      }else{
        window.JSHandle.close();
      }
    },
    getSensorData(parText) {
      return {
        sensorsData: {
            tgt_type: 'button',
            tgt_name: 'h5-LP-' + parText,
            tgt_event_id: 'h5_LP_button',
            target_url:location.href,
            url: location.href
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.pop{
  opacity: 0.4;
background: #000000;
color: #FFFFFF;
position: absolute;
top: 0;
left: 0;
bottom: 0;
right: 0;
text-align: center;
padding-top: 50%;
font-size: 1.8rem;
    letter-spacing: 2px;
}
.SocialInsurance{
  .content{
    background-image: linear-gradient(-2deg, #1C5A95 0%, #043160 88%);
    padding: 1rem 1.2rem;
    width: 100%;
    text-align: center;
     height:180px;
     position: fixed;
     top: 0;
     z-index: 99;
    .header{
      display: flex;
      margin-top: 1rem;
      justify-content: space-between;
      .owner img{
        width: 2.2rem;
      }
    }
    .title{
      font-family: PingFangSC-Regular;
      font-size: 1.3rem;
      color: #97ABB6;
      margin-top: -1.6rem;
    }
    .num{
      font-family: PingFangSC-Medium;
        font-size: 3.6rem;
        color: #FFFFFF;
    }
    .update{
      background: rgba(255,255,255,0.12);
      border-radius: 115px;
      margin:0.5rem 38% 0.8rem 38%;
      color: #FFFFFF;
      border: 0.5px solid #FFFFFF;
      font-family: PingFangSC-Regular;
      font-size: 1.6rem;
      line-height: 1.61rem;
      width: 24%;
      padding: 7px;
    }
    .updatetime{
      font-family: PingFangSC-Regular;
      font-size: 1.1rem;
      color: #FFFFFF;
    }
  }
  .iphonex{
      height: 20rem;
      .xheader{
        margin-top: 3rem;
      }
  }
  hr{
    border: 0.5px solid #E6E6E6;
    width: 100%;
  }
  .get-detail{
    position: absolute;
    height: 40px;
    top: 180px;
    width: 100%;
    .account{
      font-family: PingFangSC-Regular;
      font-size: 1.6rem;
      color: #333333;
      line-height: 1.6rem;
      width: 92%;
      margin: 0px 4% 0;
      padding: 2.8% 0;

    }
    .divide{
      background: #F7F7F7;
       width: 100%;
       height: 10px;

    }
    .account-1{
      font-family: PingFangSC-Regular;
      font-size: 1.6rem;
      color: #333333;
      line-height: 2rem;
      width: 92%;
      margin: 0px 4% 0;
      padding: 2.8% 0;
    }

    .desc{
      width: 92%;
      margin: 0 4%;
      box-sizing: border-box;
      padding: 4.6% 0;
      font-family: PingFangSC-Regular;
     font-size: 1.5rem;
     color: #666666;
     line-height: 1.4rem;
     .id{
       margin-top: 4.6%;
      }
      .where{
        margin-top: 4.6%;
        line-height: 1.5rem;
      }
      .color-type{
        color: #333333;
      }
    }
    .table{
      width: 90%;
      margin: 2.0rem 5% 2.0rem;
      text-align: center;
      font-size: 1.4rem;
      border: 1px solid #F9F9F9;
      border-collapse:collapse;
      thead tr{
        background: #E2EDF3;
        height: 3rem;
      }
      tbody td{
        background: #FFFFFF;
        height: 3.6rem;
      }
    }

  }
  .xdetail{
     top: 20rem;
  }
}

</style>
