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
                {{form.plate}}
              </el-form-item>
                <el-form-item label="发布人">
                  {{form.name}}
                </el-form-item>
                <el-form-item label="文章标题">
                    {{form.title}}
                </el-form-item>
                <el-form-item label="标签">
                {{form.labels}}
                </el-form-item>
                <el-form-item label="是否在前台展示">
                    <span v-if="isdisplay===true" type="text">是</span>
                    <span v-else> 否 </span>

                </el-form-item>
                <el-form-item label="浏览人数">
                      {{form.viewCount}}
                </el-form-item>
                <el-form-item label="内容">

                </el-form-item>
            </el-form>
        </div>
        <div  v-html="content" class="">
                {{content}}
        </div>
          <!-- <quill-editor ref="myTextEditor" v-model="content" :config="editorOption"></quill-editor> -->
        <div class="btn">
          <el-button type="primary" @click="onEdit">修订</el-button>
          <el-button type="success" @click="onSubmit">返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        data: function(){
            return {

                url:"/IPlateService/getAllplates.htm",
                url1:"/IPlateService/getAllLabels.htm",
                url2:"/IArticleService/getArticleInfoById.htm",
                // url:"http://172.20.14.24:8080/IPlateService/getAllplates.htm",
                // url1:"http://172.20.14.24:8080/IPlateService/getAllLabels.htm",
                // url2:"http://172.20.14.24:8080/IArticleService/getArticleInfoById.htm",
                content: '<p>Hello,girl</p>',
                Plate:[],
                Labels:[],
                isdisplay:'',
                form: {
                    name: '',
                    plate: '',
                    title:'',
                    labels:[],
                    viewCount:'',
                    content:''
                }
            }
        },
        created(){
              this.getAllplates();
              this.getAllLabels();
               let Id=this.$route.query.id;
               this.getInfo(Id);

        },
        methods: {
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
                    var Platelength = res.data.content.plateList.length;
                    console.log(res.data.content.plateList);
                    for (var i = 0; i < Platelength; i++) {
                      var plateList=res.data.content.plateList[i].id;
                      //console.log(plateList);
                      self.Plate[plateList]=res.data.content.plateList[i].name;
                    }
                    console.log("Plate"+self.Plate);
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
                  self.form.plate = res.data.content.articleInfo.plate.name;
                  self.form.viewCount=res.data.content.articleInfo.viewCount;
                  self.isdisplay = res.data.content.articleInfo.isFrontDeskDisplay;
                  console.log(self.isdisplay);
                  var  labelsLength=res.data.content.articleInfo.labelList.length;

                  var arr='';
                  for (var i = 0; i < labelsLength; i++) {
                     var arr=arr+","+res.data.content.articleInfo.labelList[i].name;
                  }
                  console.log(arr);
                  self.form.labels=arr;

                  self.content=res.data.content.articleInfo.context;

              }).catch(function(err){
                 console.log("查询调用文章列表失败",err)
              })
            },
            onEdit(){
              let self = this;
              let Id=self.$route.query.id;
              self.$router.push({ path: 'editcontent', query: { id: Id }});
            },
            onSubmit(){
              let self = this;
              self.$router.push({ path: 'list'});

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
