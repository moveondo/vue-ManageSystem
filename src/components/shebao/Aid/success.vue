<template lang="html">
  <div class="">
      <div class="pop">
        {{current}}
      </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
     url:"/thirdUser/IThirdUserService/checkProcessStatus",
     current:"报告获取中···",
     flag:''
    }
  },
  created() {
    let self=this;
    let type=self.GetUrlKey("type");
    //self.getinfo(type);
    self.polling();
  },
  methods: {

    GetUrlKey(name){
       return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
     },
     getinfo(type){
       let self=this;
       let isiOS = navigator.userAgent.match('iPad')
                  || navigator.userAgent.match('iPhone')
                  || navigator.userAgent.match('iPod');

       self.axios.post(self.url,{"reportSourceType":type}).then(res => {
             if(res.data.result==0 && res.data.content.processStatus==4){
               if(type==4){
                   self.$router.push({ path: 'Fund'});
               }else if(type==5){
                  self.$router.push({ path: 'SocialInsurance'});
               }else if(type==3){
                 if(isiOS){
                   window.webkit.messageHandlers.getIncomeReport.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
                 }else{
                   window.JsNutCredit.getIncomeReport();
                 }
               }
              self.flag=1;
             }
           })

     },
     polling(){
       let self=this;
       let Totalmin=0;
       let type=self.GetUrlKey("type");
       self.getinfo(type);
       let time=setInterval(function(){
           Totalmin=Totalmin+3000;

           if(self.flag==1){
              clearInterval(time);
              return false;
           }else if(Totalmin==60000){
               self.current="服务超时，请稍后重试！";
               clearInterval(time);
           }
           self.getinfo(type);
       }, 3000);
     }
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
</style>
