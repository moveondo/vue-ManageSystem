<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 文章</el-breadcrumb-item>
                <el-breadcrumb-item>文章创建</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="选择模块">
                <el-select v-model="form.plate" placeholder="请选择">
                  <el-option v-for="(item, index) of Plate"  :key="item.id"  :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="发布人">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="文章标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="封面图片">
                  <el-upload
                    class="avatar-uploader"
                    action="/IUploadFilesService/upload.htm"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <!-- <el-form-item label="标签">
                  <el-select v-model="form.labels" placeholder="请选择">
                    <el-option v-for="(Label, index) of Labels"  :key="Label.id"  :label="Label.name" :value="Label.id"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="标签">
                  <el-checkbox-group  v-model="form.labels">
                     <el-checkbox v-for="Label of Labels" :key="Label.id"  :label="Label.id" >{{Label.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否在前台展示">
                    <el-radio-group v-model="form.isdisplay">
                        <el-radio label="1" >是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
          <quill-editor ref="myTextEditor" v-model="content" :config="editorOption"></quill-editor>
        <div class="btn">
          <el-button type="primary" @click="onPreview">预览</el-button>
          <el-button type="success" @click="onSubmit">发布</el-button>
        </div>
        <div v-show="isPre">
          <div class="bg"></div>
          <div class="mobile_preview" id="mobileDiv" >
                   <!-- <img class="view" :src="wx_phone" alt=""> -->
                   <div class="mobile_preview_hd">
                    <strong class="nickname"> 信用精灵资讯</strong>
                   </div>
                   <div class="mobile_preview_bd">
                     <div class="newsinfor">
                       <div class="title">{{title}}</div>
                       <div class="info">
                         <div class="infoleft">
                           <div class="publisher">发布人:{{publisher}}</div>
                           <div class="viewCount">
                             <img class="view" :src="viewimg" alt="">
                             {{viewCount}}
                           </div>
                         </div>
                         <div class="inforight">
                           <div class="publishTime">{{publishTime | formatDate}}</div>
                         </div>
                       </div>
                       <div class="banner">
                              <img :src="bannerimg" alt="">
                       </div>
                       <div class="context" id="content" v-html="html"></div>
                     </div>
                   </div>
                   <div class="mobile_preview_ft"> </div>
                   <div class="mobile_preview_closed btn btn_default" @click="hideOut()">
                        退出预览
                   </div>
          </div>
        </div>

    </div>
</template>

<script>
    import viewimg from '../../assets/view.png';
    import { quillEditor } from 'vue-quill-editor';
    import VueCoreImageUpload  from 'vue-core-image-upload';
    import {formatDate} from '../../assets/date.js' ;
    import $ from 'jquery';
    export default {
        data: function(){
            return {
                // url:"http://172.20.14.24:8080/IPlateService/getAllplates.htm",
                // url1:"http://172.20.14.24:8080/IPlateService/getAllLabels.htm",
                // url2:"http://172.20.14.24:8080/IArticleService/saveArticle.htm",
                url:"/IPlateService/getAllplates.htm",
                url1:"/IPlateService/getAllLabels.htm",
                url2:"/IArticleService/saveArticle.htm",
                content: '',
                editorOption: {
                    // something config
                },
                Plate:[],
                Labels:[],
                isPre:false,
                bannerimg:'',
                html:'',
                viewimg:viewimg,
                form: {
                    name: '',
                    plate: '',
                    title:'',
                    labels:[],
                    isdisplay: '1'
                },
                fileList:[],
                 imageUrl: '',
                 coverPicUrl:'',
                 title:'',
                publisher:'',
                viewCount:'',
                publishTime:''
            }
        },
        components: {
            quillEditor,
            VueCoreImageUpload
        },
        filters: {
          formatDate(time) {
            if(time){
                var date = new Date(time)
            }else{
                var date = new Date()
            }
              return formatDate(date, "yyyy-MM-dd");
          }
        },
        updated() {
            $(".context").find('img').css('width','100%');
            $(".context").find('p').css('color','#666666');
         },
        created(){

              this.getAllplates();
              this.getAllLabels();
        },
        methods: {
          handleAvatarSuccess(res, file) {
            this.coverPicUrl=res.content;
            this.imageUrl = URL.createObjectURL(file.raw);
           },
           beforeAvatarUpload(file) {
             const isJPG = file.type === 'image/jpeg';
             const isLt2M = file.size / 1024 / 1024 < 2;

             if (!isJPG) {
               this.$message.error('上传头像图片只能是 JPG 格式!');
             }
             if (!isLt2M) {
               this.$message.error('上传头像图片大小不能超过 2MB!');
             }
             return isJPG && isLt2M;
           },

            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            handleChange(file, fileList) {
             this.fileList3 = fileList.slice(-3);
           },
            imageuploaded(res) {
                console.log("rr:"+res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败'
                });
            },
            getAllplates(){
                let self = this;

                self.$axios.post(self.url).then((res) => {
                    self.Plate = res.data.content.plateList;
                }).catch(function(err){
                   console.log("查询调用失败getAllplates",err)
                })

            },
            getAllLabels(){
                let self = this;
                self.$axios.post(self.url1).then((res) => {
                    self.Labels = res.data.content.labelList;
                }).catch(function(err){
                   console.log("查询调用失败getAllplates",err)
                })

            },
            onPreview(){
                let self = this;

              self.title= self.form.title;
              self.bannerimg= self.coverPicUrl;
              self.publisher=  self.form.name;
              self.viewCount= 0;
                  // console.log(self.formatDate());
             //self.publishTime= res.data.content.articleInfo.publishTime;
             self.html = self.content;
             self.isPre=true;
            },
            hideOut(){
              let self = this;
              self.isPre=false;
            },
            onSubmit(){
                console.log(this.content);
                let self = this;
                let context=this.content;
                let plateId=this.form.plate;
                let publisher=this.form.name;
                let articleTitle=this.form.title;
                let isFrontDeskDisplay=this.form.isdisplay;
                let labelIds=this.form.labelIds;
                let coverPicUrl=self.coverPicUrl;
                self.$axios.post(self.url2,{"plateId":plateId,"publisher":publisher,"articleTitle":articleTitle,
                "coverPicUrl":coverPicUrl,"isFrontDeskDisplay":isFrontDeskDisplay,"context":context,"labelIds":labelIds}).then((res) => {

                    if(res.data.content=="success"){
                        this.$message.success('提交成功！');
                        self.$router.push({ path: 'list'});
                    }
                }).catch(function(err){
                   console.log("调用失败content",err)
                })
            }
        },
        computed: {
            editor() {
                return this.$refs.myTextEditor.quillEditor;
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
    .btn{
      margin: 2% 0;
    }
    .bg{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: alpha(opacity = 75);
      -moz-opacity: .75;
      -khtml-opacity: .75;
      opacity: .75;
      background-color: rgba(0,0,0,0.5);
      z-index: 9998;
    }
  .mobile_preview {
    position: fixed;
    top: 60%;
    left: 50%;
    width: 327px;
    height: 675px;
    margin-top: -425px;
    margin-left: -161px;
    z-index: 9999;
    }
.mobile_preview {

  background:url("../../assets/bg_mobile.png") no-repeat 0 0;
  }


.mobile_preview_hd {
    height: 150px;
    text-align: center
}

.mobile_preview_hd .nickname {
    display: inline-block;
    font-weight: 400;
    padding-top: 120px;
    width: 122px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    font-size: 14px;
    color: #fff
}

.mobile_preview_bd {
    position: relative;
    height: 393px;
    margin-left: 40px;
    margin-right: 28px;
    overflow-y: scroll
}
.mobile_preview_ft {
    height: 152px
}
.mobile_preview_closed {
  position: absolute;
    left: 112px;
  min-width: 60px;
  display: inline-block;
overflow: visible;
padding: 0 22px;
height: 30px;
line-height: 30px;
vertical-align: middle;
text-align: center;
text-decoration: none;
border-radius: 3px;
-moz-border-radius: 3px;
-webkit-border-radius: 3px;
font-size: 14px;
border-width: 1px;
border-style: solid;
cursor: pointer;
background: #fff;
    border: none;
}

.title{
  font-family: PingFangSC-Medium;
  font-size: 22px;
  color: #333333;
  line-height: 26px;
}
.info{
  display: flex;
  justify-content: space-around;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  margin: 15px 0;
}
.infoleft{
  width: 100%;
  display: flex;
  justify-content: start;
}
.inforight{
  width: 60%;
  display: flex;
  justify-content: flex-end;
}
.viewCount{
  margin-left: 10px;
}
.viewCount img{
  width: 15px;
  height: 13px;
      margin: 0;
  vertical-align: middle;
}
.banner{
  margin-bottom: 3.9%;
}
.banner img{
  width: 100%;
  height: 116px;
}
.context{
  font-family: PingFangSC-Regular;
font-size: 14px;
color: #666666;
line-height: 26px;
}
.context img{
  width: 100% !important;
}

</style>
