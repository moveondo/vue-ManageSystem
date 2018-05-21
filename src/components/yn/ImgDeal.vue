<template>
 <div id="app">
        <div class="imgList">
            <div>
              <img :src="value" v-for="(value,index) in imgList" :key="index">
            </div>
            <div class="text">
                <p>KTPname:{{KTPname}}</p>
                <p>KTPname:{{KTPNO}}</p>
            </div>
          

        </div>
        <div class="imgMask" v-if="showBigImg" >
            <!-- <img class="prev"  @click.stop="prev" src="http://mobiccdai.ppdaicdn.com/source/report/image/banner3.png"> -->
            <div v-bind:class="{ showImg : isClass, go : !isClass }" style="display: block;" class="showImg" ref="IMG"  :style="'transform:rotate('+ num * 90 +'deg);'" >
                <img class="bigImg" :src="imgList[0]">
            </div>
            <!-- <img class="next"  @click.stop="next" src="http://mobiccdai.ppdaicdn.com/source/report/image/banner3.png">-->
            
        </div>
        <div class="trans">
               <span  @click="bigImg()">放大<i class="el-icon-zoom-in"></i></span> 
               <span @click.stop="showBigImg=!showBigImg">缩小<i class="el-icon-zoom-out"></i></span> 
               <span  @click="TransImg()">旋转<i class="el-icon-refresh"></i></span> 
        </div>
    </div>
</template>

<script>
    
  
  
  export default {
        
        data(){
            return{
                showBigImg:false,
                isClass:true,
                num:0,
                KTPNO:'',
                KTPname:'',
                imgList:[
            
                ]   
            }
        },
        created () {
              var imgURL=this.$route.query.url;
              var KTPname=this.$route.query.KTPname;
              var KTPNO=this.$route.query.KTPNO;
              this.imgList.push(imgURL);
              this.KTPname=KTPname;
              this.KTPNO=KTPNO;
              console.log(imgURL,KTPname,KTPNO)
   　　  //console.log(this.$refs.IMG.style.cssText)
  　　  },
        methods:{
            bigImg(index){
                this.showBigImg = true;
               // this.num = index;
            },
            TransImg(){
              this.num=this.num+1;
              console.log(this.num);
              this.isClass=!this.isClass;
            },
            prev(){
                if(this.num==0){
                    this.num =6
                }
                this.num--;
                console.log(this.num)
            },
            next(){
                if(this.num==5){
                    this.num=-1;
                }
                this.num++;
            }
        }
    }
    
</script>

<style scoped>

    .imgList{
        margin: 0 auto;
        width:900px;
        display: flex;
        flex-direction:row;
        flex-wrap:wrap;
        justify-content: space-evenly;
    }
    .imgList img{
        width:500px;
    }
    .imgMask{
        position: absolute;
        height: 100%;
        width:100%;
        top:0;
        left:0;
        z-index: 100;
        background:rgba(0,0,0,.6); 
    }
    .showImg{
        height:800px;
        width:800px;
        position: absolute;
        /* left:50%;
        top:50%; */
        /* transform:translate(-50%,-50%); */
           left: 4%;
            top: 4%;
        border:10px solid #fff;
         transition: all 1s;
    }
    .bigImg{
        width:100%;
        height:100%;
    }
    .prev{
        position: absolute;
        top:50%;
        left:10px;
        width:40px;
        transform:translate(10px,-50%);
    }
    .next{
        width:40px;
        transform:translate(10px,-50%);
        position: absolute;
        top:50%;
        right:20px;
    }
    .trans{
     position: fixed;
    bottom: 41px;
    left: 50%;
    height: 50px;
    line-height: 50px;
    width: 300px;
    border-radius: 6px;
    text-align: center;
    z-index: 100;
    background: rgba(0,0,0,.7);
    color: #fff;
    display: flex;
    justify-content: space-evenly;
    }
    .go{
      
          transition: all 1s;
      
            height: 800px;
            width: 800px;
            position: absolute;
            left: 4%;
            top: 4%;
    }
    .text{
    font-size: 16px;
    color: #48576a;
    line-height: 30px;
    }
</style>
