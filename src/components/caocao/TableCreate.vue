<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 平台</el-breadcrumb-item>
                <el-breadcrumb-item>创建平台</el-breadcrumb-item>
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
                    <el-button type="primary" @click="onSubmit">创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                url:"/ccdproduct/platform/savePlatform.htm",
                //url:"http://172.20.15.22:5555/ccdproduct/platform/savePlatform",
                form: {
                    name: '',
                    region: '',
                    logUrl: ''
                }
            }
        },
        methods: {
            onSubmit() {
                let Name=this.form.name;
                let logurl=this.form.logUrl;
                let region=this.form.region;
                if(Name=='') {
                  this.$message.error('请填写平台名称');
                  return false;
                }
                this.getData(Name,logurl,region)

            },
            getData(Name,logurl,region){
                let self = this;
                self.$axios.post(self.url, {platformName:Name,logoUrl:logurl,display:region}).then((res) => {
                    this.$message.success('创建成功！');
                    this.form.name='';
                    this.form.logUrl='';
                    this.form.region='';
                    let Id=res.data.content;
                    if(Id==null){
                      this.$message.error('请确认平台已添加');
                      return false;
                    }
                    this.$router.push({ path: 'tablesiglelist',query: { platformId: Id }});

                })
            },
        }
    }
</script>
