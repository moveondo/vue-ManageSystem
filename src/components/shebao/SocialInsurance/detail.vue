<template lang="html">
  <div>
    <div class="fixed" :class="{fixedclass:!Android}" >
      <div class="header" :class="{Androidclass:Android}" >
        <div class="arror">
          <img :src="ic_back"  @click="back()" >
        </div>
        <div class="title">
          {{title}}明细
        </div>
        <div class="owner">
          <img :src="ic_main" >
        </div>
      </div>
      <hr>
      <div class="title">
       <p>缴存时间</p>
       <p>缴存基数</p>
       <p>个人缴纳</p>
       <p>企业缴纳</p>
      </div>
      <hr>
    </div>
    <div class="SocialInsurance" :class="{Socialclass:!Android}" >
      <div class="Accountdetail" v-for="(account, index) of Accountdetail" :key="index" >
        <div class="account">{{account.recordYear}}</div>
         <hr style="border: 0.5px solid #E6E6E6; width: 100%;">
         <div class="detail1" v-for="(accountdetail, index) of account.detail" :key="index">
           <div  class="detail"  >
             <div class="time">{{accountdetail.insuredDate | formatDate }}</div>
             <div class="much">{{accountdetail.depositBase}}</div>
             <div class="action">{{ accountdetail.personalAmount}}</div>
             <div class="where">{{accountdetail.companyAmount}}</div>
           </div>
           <hr>
         </div>
      </div>
    </div>
  <router-view></router-view>
  </div>
</template>
<script>
import ic_back from '../../common/icons/ic_back.png';
import ic_main from '../../common/icons/main.png';
import {formatDate} from '../../common/js/date.js' ;
export default {
  data () {
    return {
       //url:"http://172.20.14.24:8082/creditApi/ICreditReportService/insurancDetails",
      url:"/creditApi/ICreditReportService/insurancDetails",
      ic_back:ic_back,
      ic_main:ic_main,
      Android:false,
      Accountdetail:[],
      title:''
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
    let type=self.$route.query.type;
    if(type==1){
      self.title="养老保险";
    }else if(type==2){
      self.title="医疗保险";
    }else if(type==3){
      self.title="工伤保险";
    }else if(type==4){
      self.title="失业保险";
    }else if(type==5){
      self.title="生育保险";
    }
    let isAndroid  = navigator.userAgent.match('Android');
    if(isAndroid){
      self.Android=true;
    }
    let reportId=self.$route.query.reportId;
    self.axios.post(self.url,{"reportId":reportId,"insurancType":type,"pageNo":1,"pageSize":1000}).then(res => {
      if(res.data.result==0){
        self.Accountdetail=res.data.content.details;
      }
    })
  },
  methods: {
    back(){
      let self=this;
      self.$router.go(-1);
      // window.JSHandle.close();
    }
  }
}
</script>

<style lang="scss" scoped>

hr{
  border: 0.5px solid #E6E6E6;
  width: 100%;
}
.header{
  display: flex;
  justify-content: space-between;
  padding:3rem 5% 0;
  font-family: PingFangSC-Regular;
  font-size: 1.7rem;
  color: #333333;
  line-height: 4rem;
  img{
    vertical-align: middle;
  }
  .owner img{
    width: 2.2rem;
    visibility: hidden;
  }
}
.Androidclass{
  padding:3% 5% 0%;
}
.fixed{
  height: 10.8rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1111;
  background: #fff;
  .title{
    display: flex;
    justify-content: space-around;
    padding:1.6rem 5%;
    font-family: PingFangSC-Regular;
    font-size: 1.6rem;
    color: #333333;
    line-height: 1.6rem;
  }
  .account{
    background: #F9F9F9;
    font-family: PingFangSC-Medium;
    font-size: 1.5rem;
    color: #666666;
    line-height: 1.5rem;
    padding:1.2rem 5%;
  }
}
.fixedclass{
    height: 12.8rem;
}
.SocialInsurance{
  position: absolute;
    top: 10.8rem;
    left: 0;
    width: 100%;
    .account{
      background: #F9F9F9;
      font-family: PingFangSC-Medium;
      font-size: 1.4rem;
      color: #666666;
      line-height: 1.4rem;
      padding:1.2rem 5%;
    }
    .detail{
      display: flex;
      // justify-content: space-between;
      font-family: PingFangSC-Regular;
      font-size: 1.4rem;
      color: #666666;
      line-height: 1.4rem;
      padding:1.5rem 5%;
      text-align: center;
      .time{
        width: 30%;
      }
      .much,.action,.where{
        width: 23.3%;
      }
    }
}
.Socialclass{
  top: 12.8rem;
}


</style>
