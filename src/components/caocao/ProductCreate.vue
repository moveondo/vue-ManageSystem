<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 产品</el-breadcrumb-item>
                <el-breadcrumb-item>创建产品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="平台名称">
                    <el-select v-model="form.platformName" placeholder="请选择">
                      <el-option v-for="(item, index) of Properties"  :key="item.platformName"  :label="item.platformName" :value="item.platformId"></el-option>
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
                    <el-button type="primary" @click="onSubmit">保存</el-button>
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
                url:"/ccdproduct/product/saveProductBaseInfo.htm",
                url0:"/ccdproduct/platform/queryAllPlatformInfo.htm",
                // url:"http://172.20.15.22:5555/ccdproduct/product/saveProductBaseInfo",
                // url0:"http://172.20.15.22:5555/ccdproduct/platform/queryAllPlatformInfo",
                form: {
                    platformName: '',
                    productName: '',
                    productUrl: '',
                    productPresentation:'',
                    display:''
                },
                itemList:Array,
                Properties:[],
            }
        },
        created(){
            this.getDataQuery();
        },
        methods: {
            onSubmit() {
                let platformId=this.form.platformName;
                let productName=this.form.productName;
                let productUrl=this.form.productUrl;
                let Presentation=this.form.productPresentation;
                let display=this.form.display;
                let platformname=this.itemList[platformId];

                console.log(platformname);
                if(platformId=='') {
                  this.$message.error('请填写平台名称');
                  return false;
                }
                this.getData(platformId,platformname,productName,productUrl,Presentation,display)

            },
            getDataQuery(){
                let self = this;
                self.$axios.post(self.url0,{}).then((res) => {
                    self.Properties=res.data.content;
                    for(var i= 0,len=self.Properties.length;i<len;i++){

                      let platformId = self.Properties[i].platformId;
                      let platformName = self.Properties[i].platformName;
                    //  alert(buteName)
                       self.itemList[platformId] = platformName;
                    }

                    //console.log(this.Properties);
                }).catch(function(err){
                   console.log("调用失败1",err)
                })
            },
            getData(platformId,platformname,productName,productUrl,Presentation,display){
                let self = this;
                self.$axios.post(self.url, {"platformId":platformId,"platformName":platformname,"productName":productName,"productUrl":productUrl,"productPresentation":Presentation,"display":display}).then((res) => {
                    let productId=res.data.content;
                    console.log(productId);
                    this.$router.push({ path: 'productcreate1',query: { "productId": productId }});
                }).catch(function(err){

                   console.log("调用失败",err)
                })
            },
            onCancel(){
              this.form.platformName='';
              this.form.productName='';
              this.form.productUrl='';
              this.form.productPresentation='';
              this.form.display='';
            }
        }
    }
</script>
