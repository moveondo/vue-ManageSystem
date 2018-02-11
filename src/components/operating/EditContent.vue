<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 文章</el-breadcrumb-item>
                <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
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
                  <div class="">
                    <img v-if="oldCoverPicUrl" :src="oldCoverPicUrl" class="avatar">
                  </div>
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
                <el-form-item label="标签">
                  <el-checkbox-group   v-model="form.labels">
                     <el-checkbox v-for="Label of Labels" :key="Label.id"  :label="Label.id">{{Label.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否在前台展示">
                  <template>
                  <!-- <el-radio-group  v-model="isdisplay" >
                        <el-radio   label="true" >是</el-radio>
                        <el-radio   label="false">否</el-radio>
                 </el-radio-group> -->
                 <el-switch
                  v-model="isdisplay"
                  active-text="是"
                  inactive-text="否"
                  >
                </el-switch>
               </template>
                </el-form-item>
                <el-form-item label="浏览人数">
                    <el-input v-model="form.viewCount"></el-input>
                </el-form-item>
            </el-form>
        </div>
          <quill-editor ref="myTextEditor" v-model="content" :config="editorOption"></quill-editor>
        <div class="btn">

          <el-button type="success" @click="onSubmit">确认修订</el-button>
          <el-button type="primary" @click="onPreview">返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
    import VueCoreImageUpload  from 'vue-core-image-upload';
    export default {
        data: function(){
            return {
              url:"/IPlateService/getAllplates.htm",
              url1:"/IPlateService/getAllLabels.htm",
              url2:"/IArticleService/getArticleInfoById.htm",
              url3:"/IArticleService/saveArticle.htm",
                // url:"http://172.20.14.24:8080/IPlateService/getAllplates.htm",
                // url1:"http://172.20.14.24:8080/IPlateService/getAllLabels.htm",
                // url2:"http://172.20.14.24:8080/IArticleService/getArticleInfoById.htm",
                // url3:"http://172.20.14.24:8080/IArticleService/saveArticle.htm",
                content: '',
                editorOption: {
                    // something config
                },
                Plate:[],
                Labels:[],
                isdisplay:'',
                imageUrl:'',
                form: {
                    name: '',
                    plate: '',
                    title:'',
                    labels:[],
                    viewCount:''
                },
                coverPicUrl:'',
                oldCoverPicUrl:''
            }
        },
        components: {
            quillEditor,
            VueCoreImageUpload
        },
        created(){
              this.getAllplates();
              this.getAllLabels();
               let Id=this.$route.query.id;
               this.getInfo(Id);
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
            getInfo(id){
              let self = this;
              self.$axios.post(self.url2,{"articleId":id}).then((res) => {
                  self.form.name = res.data.content.articleInfo.publisher;
                  self.form.title = res.data.content.articleInfo.articleTitle;
                  self.form.plate = res.data.content.articleInfo.plate.id;
                  self.isdisplay = res.data.content.articleInfo.isFrontDeskDisplay;
                  self.form.viewCount=res.data.content.articleInfo.viewCount;
                  self.oldCoverPicUrl=res.data.content.articleInfo.coverPicUrl;
                  console.log(self.isdisplay);
                  var  labelsLength=res.data.content.articleInfo.labelList.length;

                  var arr=Array();
                  for (var i = 0; i < labelsLength; i++) {
                    arr.push(res.data.content.articleInfo.labelList[i].id);
                  }

                  self.form.labels=arr;
                  self.content=res.data.content.articleInfo.context;

              }).catch(function(err){
                 console.log("查询调用文章列表失败",err)
              })
            },
            onPreview(){
                let self = this;
                self.$router.push({ path: 'list'});
            },
            onSubmit(){
                console.log(this.content);
                let self = this;
                 let Id=this.$route.query.id;
                let context=this.content;

                let plateId=this.form.plate;
                let publisher=this.form.name;
                let articleTitle=this.form.title;
                let isFrontDeskDisplay=this.isdisplay;
                let labelIds=this.form.labelIds;
                let viewCount=this.form.viewCount;
                let coverPicUrl=self.coverPicUrl;
                self.$axios.post(self.url3,{"id":Id,"plateId":plateId,"publisher":publisher,"articleTitle":articleTitle,
                "coverPicUrl":coverPicUrl,"isFrontDeskDisplay":isFrontDeskDisplay,"viewCount":viewCount,"context":context,"labelIds":labelIds}).then((res) => {

                    if(res.data.content=="success"){
                        this.$message.success('提交成功！');

                        self.$router.push({ path: 'readcontent', query: { id:Id}});
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
</style>
