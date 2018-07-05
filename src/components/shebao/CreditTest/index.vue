<template lang="html">
<div >
  <div class="progress" :style="{width:progress+'%'}">
  </div>
   <div class="content" v-if="index==1">
     <div class="direaction">
       <span class="current">1</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您的年龄
     </div>
     <div class="desc">
      <p class="age-full"  :class="{ 'active': selected == 1 }"   @click="add('first',0,1)"  > 17岁以下</p>
      <p class="age"  :class="{ 'active': selected == 2 }"  @click="add('first',1,2)"> 18-25岁 </p>
      <p class="age"  :class="{ 'active': selected == 3 }"  @click="add('first',2,3)"> 26-33岁 </p>
      <p class="age"  :class="{ 'active': selected == 4 }"    @click="add('first',3,4)"> 34-55岁 </p>
      <p class="age"  :class="{ 'active': selected == 5 }"  @click="add('first',4,5)"> 56岁以上 </p>
     </div>
   </div>
   <div class="content" v-if="index==2">
     <div class="direaction">
       <span class="current">2</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您的实名手机号使用时长？
     </div>
     <div class="desc">
      <p class="age-full"  :class="{ 'active': selected == 6 }"     @click="add('two',0,6)"> 3个月以内</p>
      <p class="age"  :class="{ 'active': selected == 7 }"    @click="add('two',1,7)"> 3-6个月 </p>
      <p class="age"  :class="{ 'active': selected == 8 }"   @click="add('two',2,8)"> 6个月及以上 </p>
      <p class="age"  :class="{ 'active': selected == 9 }"   @click="add('two',3,9)"> 没有实名 </p>
     </div>
   </div>
   <div class="content" v-if="index==3">
     <div class="direaction">
       <span class="current">3</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您的芝麻信用分？
     </div>
     <div class="desc">
      <p class="age-full" :class="{ 'active': selected == 10 }"   @click="add('three',0,10)"> 600分以下</p>
      <p class="age"  :class="{ 'active': selected == 11 }"    @click="add('three',1,11)"> 600-650分 </p>
      <p class="age" :class="{ 'active': selected == 12 }"     @click="add('three',2,12)"> 651-700分 </p>
      <p class="age"  :class="{ 'active': selected == 13 }"   @click="add('three',3,13)"> 701及以上 </p>
     </div>
   </div>
   <div class="content" v-if="index==4">
     <div class="direaction">
       <span class="current">4</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您在目前单位的工作时长？
     </div>
     <div class="desc">
      <p class="age-full"  :class="{ 'active': selected == 14 }"     @click="add('four',0,14)"> 3个月以内</p>
      <p class="age"  :class="{ 'active': selected == 15 }"    @click="add('four',1,15)"> 3-6个月 </p>
      <p class="age" :class="{ 'active': selected == 16 }"   @click="add('four',2,16)"> 6个月以上 </p>
      <p class="age" :class="{ 'active': selected == 17 }"     @click="add('four',3,17)"> 无工作/个体经营 </p>
     </div>
   </div>
   <div class="content" v-if="index==5">
     <div class="direaction">
       <span class="current">5</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您目前的收入？
     </div>
     <div class="desc">
      <p class="age-full" :class="{ 'active': selected == 18 }"    @click="add('five',0,18)"> 2000元及以内</p>
      <p class="age" :class="{ 'active': selected == 19 }"   @click="add('five',1,19)"> 2001-3000元 </p>
      <p class="age" :class="{ 'active': selected == 20 }"   @click="add('five',2,20)"> 3001-8000元 </p>
      <p class="age" :class="{ 'active': selected == 21 }"    @click="add('five',3,21)"> 8001元及以上 </p>
     </div>
   </div>
   <div class="content" v-if="index==6">
     <div class="direaction">
       <span class="current">6</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您的信用卡使用情况？
     </div>
     <div class="desc">
      <p class="age-full" :class="{ 'active': selected == 22 }"   @click="add('six',0,22)"> 无信用卡</p>
      <p class="age" :class="{ 'active': selected == 23 }"     @click="add('six',1,23)"> 用卡6个月以内 </p>
      <p class="age" :class="{ 'active': selected == 24 }"    @click="add('six',2,24)"> 用卡6个月以上 </p>
     </div>
   </div>
   <div class="content" v-if="index==7">
     <div class="direaction">
       <span class="current">7</span>
       <span>/</span>
       <span class="total">7</span>
     </div>
     <div class="title">
        您的信用记录？
     </div>
     <div class="desc">
      <p class="age-full" :class="{ 'active': selected == 25 }"  @click="add('seven',0,25)"> 信用良好无逾期</p>
      <p class="age" :class="{ 'active': selected == 26 }"      @click="add('seven',1,26)"> 有1~2次逾期 </p>
      <p class="age" :class="{ 'active': selected == 27 }"    @click="add('seven',2,27)"> 有3次及以上逾期 </p>
      <p class="age"  :class="{ 'active': selected == 28 }"   @click="add('seven',3,28)"> 无信用记录 </p>
     </div>
   </div>
   <div class="content" v-if="index==8">
      <div class="bg" :style="bg">
        <div class="exp">最终结果  </div>
        <div class="num">{{sum}}  </div>
      </div>
      <div class="button" @click="again()"> 再测一次</div>
      <div class="tips">测试结果仅供参考</div>
   </div>
</div>
</template>

<script>
import ic_bg from '../../common/icons/bg.png';
export default {
  data () {
    return {
        index:1,
        first:[500,1000,1000,500,500],
        two:[500,500,1000,0],
        three:[500,500,1000,1000],
        four:[0,500,1000,500],
        five:[0,500,500,1000],
        six:[0,500,1000],
        seven:[1000,500,0,500],
        sum:0,
        selected: null,
        progress:14,
        bg: {
        backgroundImage: 'url(' + require('../../common/icons/bg.png') + ')',
        }
    }
  },
  methods: {
    add(type,num,index){
      let self=this;
      self.selected = index;

      if(type=='first'){
        self.sum+=self.first[num];
      }else if(type=='two'){
        self.sum+=self.two[num];
      }else if(type=='three'){
        self.sum+=self.three[num];
      }else if(type=='four'){
        self.sum+=self.four[num];
      }else if(type=='five'){
        self.sum+=self.five[num];
      }else if(type=='six'){
        self.sum+=self.six[num];
      }else if(type=='seven'){
        self.sum+=self.seven[num];
      }

      setTimeout(function () {
        self.index=self.index>8? 8 : self.index+1;
        self.progress =parseInt(100/7)*self.index>100?100:parseInt(100/7)*self.index;
      }, 400)

    },

    again(){
      let self=this;
      self.index=1;
      self.sum=0;
      self.progress=14;
      self.selected=0;
    }
  }
}
</script>

<style lang="scss" scoped>

.progress{
       height: 3px;
        background: #049AFF;
       line-height: 20px;
}
 .content{
   width: 84%;
   margin: 0 8%;

   .direaction{
      font-family: PingFang-SC-Medium;
      font-size: 1.4rem;
      color: #B1DFFF;
      margin-top: 1.7rem;
     .current{
       font-family: PingFang-SC-Bold;
        font-size: 3.8rem;
        color: #049AFF;
     }
   }
   .title{
     font-family: PingFang-SC-Medium;
      font-size: 1.8rem;
      color: #049AFF;
      line-height: 1.8rem;
      margin-bottom:3.6rem;
      margin-top: 0.8rem;
   }
   p{
     font-family: PingFang-SC-Regular;
      font-size: 1.6rem;
      color: #666666;
      line-height: 1.6rem;
      padding: 2.2rem 0;
   }
   .age-full{
     border-top: 1px solid #F9F9F9;
     border-bottom: 1px solid #F9F9F9;
   }
   .age{
      border-bottom:1px solid #F9F9F9;
   }
   .bg{
     background: no-repeat center;
      background-size: contain;
      height: 22rem;
      margin-top: 7.1rem;
      // box-shadow: 0 2px 4px 0 rgba(200,218,219,0.50);
      position: relative;
      // position: absolute;
      // top: 7.1rem;
      .exp{
        font-family: PingFang-SC-Medium;
         font-size: 1.6rem;
         color: #707070;
         position: absolute;
         top: 36%;
         left: 40%;
      }
      .num{
        font-family: PingFang-SC-Bold;
         font-size: 3.0rem;
         color: #FFAF00;
         position: absolute;
          top: 56%;
          left: 40%;
      }
   }

   .button{
     background: #049AFF;
      border-radius: 64px;
      width: 84%;
      margin: 6.1rem 8% 0;
      color: #FFFFFF;
      height: 45px;
      line-height: 45px;
      text-align: center;
      font-size: 1.8rem;
   }
   .tips{
     font-family: PingFang-SC-Regular;
      font-size: 1.2rem;
      color: #97ABB6;
      line-height: 1.3rem;
        text-align: center;
        margin-top: 1rem;
   }
   .active{
     font-family: PingFang-SC-Regular;
      font-size: 1.6rem;
      color: #049AFF;
      line-height: 1.6rem;
   }
 }


</style>
