<template lang="html">
<div >
 <div class="account">
   <div class="content" :class="{xcontent:isiphonex,Androidclass:Android}" >
     <div class="header" >
       <div class="arror">
         <img :src="ic_back" @click="back()">
       </div>
       <div class="title">账户管理 </div>
       <div class="owner">
         <img :src="ic_back" >
       </div>
     </div>
   </div>
   <hr>
   <div v-if="report_type === 'AccumulationFund'">
     <div class="detail"  v-for="(account, index) of Accountdetail" :key="index" @click="read(account.latestReportId)">
       <!-- <div  v-for="(account, index) of Accountdetail" :key="index"> -->
         <div class="left">
           <div class="title">
             <div class="">
               <span class="name">{{account.accountName}}</span>
               <span class="pending">{{account.status}}</span>
               <span class="mark" v-if="accountNum === account.accountNum"><img :src="ic_mark"></span>
             </div>
            <div class="where">  {{account.organizationName}}</div>
            <div class="client">  客户号:{{account.accountNum}}</div>
           </div>
         </div>
         <div class="right" @click.stop="delete1(account.accountId)"> 删除 </div>

         <div style="clear:both"></div>
           <hr>
       <!-- </div> -->
     </div>
   </div>
   <div v-if="report_type === 'SocialSecurity'">

     <div class="detail"  v-for="(account, index) of Accountdetail" :key="index" @click="read(account.latestReportId)">
       <!-- <div  v-for="(account, index) of Accountdetail" :key="index"> -->
         <div class="left">
           <div class="title">
             <div class="">
               <span class="name">{{account.accountName}}</span>
               <span class="mark" v-if="accountNum === account.accountNum"><img :src="ic_mark"></span>
             </div>
            <div class="where social">  {{account.organizationName}}</div>
            <div class="client">  报告更新时间:{{account.updateTime | formatDate}}</div>
           </div>
         </div>
         <div class="right" @click.stop="delete1(account.accountId)"> 删除 </div>

         <div style="clear:both"></div>
           <hr>
       <!-- </div> -->
     </div>

   </div>
   <div class="add" @click="addAccount()">
      + 添加账户
   </div>
  </div>
</div>
</template>

<script>
import ic_back from '../../common/icons/ic_back.png';
import ic_mark from '../../common/icons/mark.png';
import {formatDate} from '../../common/js/date.js' ;
import sensorsData from '../../common/js/sensorsData.js'
import {doSensors} from '../../common/js/sensorsEvent.js' ;
export default {
  data () {
    return {
      // url:"http://172.20.15.37:8080/creditApi/IReportAccount/queryUserAccountList",
      // url1:"http://172.20.15.37:8080/creditApi/IReportAccount/deleteUserAccountAndReports",
      // url2:"/thirdUser/IThirdUserService/getInvokeInfo.htm",
      url:"/creditApi/IReportAccount/queryUserAccountList",
      url1:"/creditApi/IReportAccount/deleteUserAccountAndReports",
      url2:"/thirdUser/IThirdUserService/getInvokeInfo.htm",
      ic_back:ic_back,
      ic_mark:ic_mark,
      Accountdetail:[],
      report_type:"",
      accountNum:'',
      isiphonex:false,
      Android:false
    }
  },
  components: {

  },
  updated() {

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
    let isAndroid  = navigator.userAgent.match('Android');
    if(isAndroid){
      self.Android=true;
    }

    let type=self.$route.query.type;
    let accountNum=self.$route.query.accountNum;
    self.accountNum=accountNum;
    if(type=="shebao"){
      self.report_type='SocialSecurity';
    }else if(type=="gongjijin"){
      self.report_type='AccumulationFund';
    }
    self.QueryData();
  },
  methods: {
  QueryData(){
      let self=this;
      self.Accountdetail=Array();
      self.axios.post(self.url,{accountType:self.report_type})
          .then(res => {
            if(res.data.result==0){
              let size=res.data.content.length;
              if(size==0 || size==null){
                self.backindex();
              }else{
                  self.Accountdetail=res.data.content;
              }

            }
          })
    },
    delete1(id){
        let self=this;
        let type=self.$route.query.type;
        let Sensorspoint;
        if(type=="gongjijin"){
            Sensorspoint="公积金删除";
        }else if(type=="shebao"){
             Sensorspoint="社保删除";
        }
      doSensors(self.getSensorData(Sensorspoint).sensorsData);

        var mymessage=self.confirm("确认删除该账户？");
        if(mymessage==true){
          self.axios.post(self.url1,{"accountId":id})
              .then(res => {
                if(res.data.result==0){
                    self.QueryData();
                }
              })
        }else{
          return false;
        }
    },
    read(latestReportId){
        let self=this;
        let type=self.$route.query.type;
        if(type=="shebao"){
          self.$router.push({ path: 'SocialInsurance', query: { reportId:latestReportId}});
        }else if(type=="gongjijin"){
          self.$router.push({ path: 'Fund', query: { reportId:latestReportId}});
        }
    },
    addAccount(){

      let self=this;
      let type=self.$route.query.type;
      let reportSourceType,clientType,Sensorspoint;
      if(type=="gongjijin"){
          reportSourceType=4;
          Sensorspoint="公积金添加账户";
      }else if(type=="shebao"){
           reportSourceType=5;
           Sensorspoint="社保添加账户";
      }
    doSensors(self.getSensorData(Sensorspoint).sensorsData);


      let isiOS = navigator.userAgent.match('iPad')
                 || navigator.userAgent.match('iPhone')
                 || navigator.userAgent.match('iPod');
      let isAndroid  = navigator.userAgent.match('Android');
      if(isiOS){
        clientType=6;
        window.webkit.messageHandlers.showNav.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
      }else if(isAndroid){
        clientType=7;
        window.JsNutCredit.showNav();
      } else{ clientType=5; }

     self.axios.post(self.url2,{"reportSourceType":reportSourceType,"clientType":clientType}).then(res => {
           if(res.data.result==0){
             let Url=res.data.content.actionUrl;
             if(Url){
                window.location.href=Url;
             }
           }
      })

    },
    back(){
      let self=this;
      self.$router.go(-1);
    },
    isIphoneX(){
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
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
    confirm(message) {
        try {
            var iframe = document.createElement("IFRAME");
            iframe.style.display = "none";
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            var alertFrame = window.frames[0];
            var iwindow = alertFrame.window;
            if (iwindow == undefined) {
                iwindow = alertFrame.contentWindow;
            }
            var result=iwindow.confirm(message);
            iframe.parentNode.removeChild(iframe);
            return result;
        }
        catch (exc) {
            return confirm(message);
        }
    },
    backindex(){

      let isiOS = navigator.userAgent.match('iPad')
                 || navigator.userAgent.match('iPhone')
                 || navigator.userAgent.match('iPod');
      if(isiOS){
        window.webkit.messageHandlers.close.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
      }else{
        window.JSHandle.close();
      }
    }


  }
}
</script>

<style lang="scss" scoped>
.account{
  .content{
    padding:3rem 4% 3%;
    width: 100%;
    text-align: center;
    .header{
      display: flex;
      justify-content: space-between;
      .title{
        font-family: PingFangSC-Regular;
      font-size: 1.7rem;
      color: #333333;
      line-height: 1.7rem;
      }
      .owner{
        visibility:hidden;
      }
    }
  }
  .xcontent{
    padding:4rem 4% 3%;
  }
  .Androidclass{
    padding:3.5% 4% 3%;
  }
  hr{
    border: 0.5px solid #E6E6E6;
    width: 100%;
  }
  .detail{
    padding: 2.8%  5.3%;
    .left{
      float: left;
      width: 75%;
      .title .name{
        font-family: PingFangSC-Medium;
        font-size: 1.6rem;
        color: #333333;
        line-height: 1.6rem;
        font-weight: bold;
      }
      .title .mark img{
        width: 12px;
        height: 8px;
        margin-left: 11px;
      }
      .pending{
        border: 1px solid #AAC1DC;
        border-radius: 2px;
        font-family: PingFangSC-Medium;
        font-size: 1.3rem;
        color: #AAC1DC;
        letter-spacing: 0;
        line-height: 1.3rem;
        margin-left: 2.6%;
        padding: 1% 3%;
      }
      .where{
        font-family: PingFangSC-Regular;
        font-size: 1.4rem;
        color: #666666;
        line-height: 1.4rem;
        margin-top:1.9rem;
        margin-bottom: 1.0rem;
      }
      .social{
          margin-top:1.4rem;
      }
      .client{
        font-family: PingFangSC-Regular;
        font-size: 1.4rem;
        color: #666666;
        line-height: 1.4rem;
        margin-bottom: 1.9rem;
      }
    }
    .right{
      float: right;
      // line-height: 5.0rem;
      margin-top: 2.0rem;
      border: 1px solid #979797;
      border-radius: 20px;
      color: #979797;
      padding: 1% 6%;
      font-size: 1.3rem;
    }
  }

}
.add{
    font-family: PingFangSC-Regular;
    font-size: 1.6rem;
    color: #049AFF;
    text-align:center;
    width: 88%;
    margin: 3% 6%;
    padding: 12px 0;
    border: 1px dotted #C1C1C1;
    border-radius: 4px;
}

</style>
