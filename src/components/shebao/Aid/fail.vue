<template lang="html">
  <div class="">
      <div class="pop">
        <div class="">
          {{current}}
        </div>
        <div class="button" @click="getinfo()">
           重新查询
        </div>
      </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      url:"/thirdUser/IThirdUserService/getInvokeInfo.htm",
      current:"查询失败，请点击重试",
    }
  },
  created() {

  },
  methods: {
    getinfo(){
      let self=this;
      let type=self.GetUrlKey("type");
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
     self.axios.post(self.url,{"reportSourceType":type,"clientType":clientType}).then(res => {
           if(res.data.result==0){
             let Url=res.data.content.actionUrl;
             if(Url){
                window.location.href=Url;
             }

           }
      })

    },
    GetUrlKey(name){
       return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
     },
  }
}
</script>

<style lang="scss" scoped>
.pop{

background: #939393;
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
.button{
  opacity: 1;
  background: #049AFF;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 1.6rem;
  color: #FFFFFF;
  height: 40px;
  line-height: 40px;
  width: 42%;
  margin: 2.8rem 29%;
}
</style>
