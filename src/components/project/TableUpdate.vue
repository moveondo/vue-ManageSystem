<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 筛选条件</el-breadcrumb-item>
                <el-breadcrumb-item>创建筛选条件</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
          <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="平台名称">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="log地址">
                  <el-input type="textarea" v-model="form.logUrl"></el-input>
              </el-form-item>
              <el-form-item label="是否展示">
                  <el-select v-model="form.region" placeholder="请选择">
                      <el-option key="bbk" label="是" :value="true"> </el-option>
                      <el-option key="xtc" label="否" :value="false"> </el-option>
                  </el-select>
              </el-form-item>

              <el-form-item>
                  <el-button type="primary" @click="onUpdate">更新</el-button>
                  <el-button  @click="onCancel">取消</el-button>
              </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
              url:"/ccdproduct/platform/updatePlatform.htm",
              form: {
                  name: '',
                  region: '',
                  logUrl: ''
              }
            }
        },
        created(){

            let Id=this.$route.query.platformId;
            this.getDataQueryName(Id);
        },
        methods: {
            onUpdate() {
                let Name=this.form.name;
                let Region=this.form.region;
                let Logurl=this.form.logUrl;
                let Id=this.form.Id;//增加ID

                if(Name=='') {
                  this.$message.error('请填写平台名称');
                  return false;
                }
                this.getData(Name,Region,Logurl,Id);
            },
            getDataQueryName(Id){
              let self = this; //
              self.$axios.get("/ccdproduct/platform/queryPlatformById.htm?platformId="+Id).then((res) => {
                  this.form.name=res.data.content.platformName;
                  this.form.logUrl=res.data.content.logoUrl;
                  this.form.region=res.data.content.isDisplay;
                  this.form.Id=Id;

              }).catch(function(err){
                 console.log("调用失败0",err)
              })
            },
            getData(Name,Region,Logurl,Id){
                let self = this;
                self.$axios.post(self.url, {"platformName":Name,"display":Region,"logoUrl":Logurl,"platformId":Id }).then((res) => {
                    this.$message.success('更新成功！');
                    this.form.name='';
                    this.form.region='';
                    this.form.logUrl='';
                    this.$router.push({ path: 'tablesiglelist',query: { platformId: Id }});
                }).catch(function(err){
                   console.log("调用失败2",err)
                })
            },
            onCancel(){
              this.form.name='';
              this.form.region='';
              this.form.logUrl='';
            }
        }
    }
</script>
