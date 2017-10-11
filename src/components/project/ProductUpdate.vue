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
                   <el-select v-model="form.platformName" placeholder="请选择" > <!--@change="selectVal" -->
                    <el-option v-for="(item, index) of Properties"  :label="item.platformName" :value="item.platformId"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="产品名称">
                  <el-input v-model="form.productName"></el-input>
              </el-form-item>
              <el-form-item label="访问地址">
                  <el-input type="textarea" v-model="form.productUrl"></el-input>
              </el-form-item>
              <el-form-item label="申请材料">
                  <el-input type="textarea" v-model="form.productPresentation"></el-input>
              </el-form-item>
              <el-form-item label="是否展示">
                  <el-select v-model="form.display" placeholder="请选择">
                      <el-option key="bbk" label="是" :value="true"> </el-option>
                      <el-option key="xtc" label="否" :value="false"> </el-option>
                  </el-select>
              </el-form-item>

              <el-form-item>
                  <el-button type="primary" @click="onUpdate">更新</el-button>
                  <el-button @click="onCancel">取消</el-button>
              </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                url:"/ccdproduct/product/queryProductById.htm",
                url0:"/ccdproduct/platform/queryAllPlatformInfo.htm",
                url1:"/ccdproduct/product/updateProductBaseInfo.htm",
                itemList:Array,
                Properties:[],
                form: {
                    platformName: '',
                    productName: '',
                    productUrl: '',
                    productPresentation:'',
                    display:''
                }
            }
        },
        created(){
            this.getDataQueryName();
            let Id=this.$route.query.productId;
            this.getDataQuery(Id);
        },
        methods: {
          // selectVal: function(ele) {
          // //  alert(ele) 此为平台ID 应该为产品ID
          //     this.getDataQuery(ele)
          //   //this.selected = ele.target.value;
          //  },
            onUpdate() {

                let platformId=this.form.platformName;
                let productName=this.form.productName;
                let productUrl=this.form.productUrl;
                let productPresentation=this.form.productPresentation;
                let isDisplay=this.form.display;
                let platformName=this.itemList[platformId];

                let Id=this.form.Id;//增加ID
                console.log(platformName,isDisplay);
                if(platformName=='') {
                  this.$message.error('请填写平台名称');
                  return false;
                }else if(productName==''){
                  this.$message.error('请填写产品名称');
                  return false;
                }
                this.UpdateData(platformId,productName,productUrl,productPresentation,isDisplay,Id,platformName);
            },
            getDataQueryName(){
                let self = this;
                self.$axios.post(self.url0,{}).then((res) => {
                    self.Properties=res.data.content;

                    for(var i= 0,len=self.Properties.length;i<len;i++){

                      var platformId = self.Properties[i].platformId;
                      var platformName = self.Properties[i].platformName;
                    //  alert(buteName)
                       self.itemList[platformId] = platformName;
                    }

                }).catch(function(err){
                   console.log("调用失败1",err)
                })
            },
            getDataQuery(Id){
              let self = this;
              self.$axios.get("/ccdproduct/product/queryProductById.htm?productId="+Id).then((res) => {
                  this.form.productName=res.data.content.productName;
                  this.form.productUrl=res.data.content.productUrl;
                  this.form.productPresentation=res.data.content.productPresentation;
                  this.form.display=res.data.content.isDisplay;
                  this.form.platformName=res.data.content.platformId;
                  this.form.Id=Id;

              }).catch(function(err){
                 console.log("调用失败0",err)
              })
            },
            UpdateData(platformid,productName,productUrl,productPresentation,isDisplay,productId,platformName){
                let self = this;
                self.$axios.post(self.url1, {"platformId":platformid,"productName":productName,"productUrl":productUrl,
                  "productPresentation":productPresentation,"display":isDisplay,"productId":productId,"platformName":platformName }).then((res) => {
                    this.$message.success('更新成功！');
                    this.form.productName='';
                    this.form.productUrl='';
                    this.form.productPresentation='';
                    this.form.isDisplay='';
                    this.form.platformName='';
                    this.$router.push({ path: 'productupdate1',query: { "productId": productId }});
                }).catch(function(err){
                   console.log("调用失败2",err)
                })
            },
            onCancel(){
              this.form.productName='';
              this.form.productUrl='';
              this.form.productPresentation='';
              this.form.isDisplay='';
              this.form.platformName='';
            }
        }
    }
</script>
