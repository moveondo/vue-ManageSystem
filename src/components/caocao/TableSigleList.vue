<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 平台详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="平台名称">
                    <div class="">
                      {{form.name}}
                    </div>
                </el-form-item>
                <el-form-item label="log地址">
                    <div class="">
                      {{form.logurl}}
                    </div>
                </el-form-item>
                <el-form-item label="是否展示">
                    <!-- <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="bbk" label="是" value="true"> </el-option>
                        <el-option key="xtc" label="否" value="false"> </el-option>
                    </el-select> -->
                    <div class="">
                      {{form.region}}
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onUpdate(form.Id)">更新平台信息</el-button>
                    <el-button @click="goTable">返回平台列表</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                form: {
                    name: '',
                    region: '',
                    logurl: ''
                }
            }
        },
        created(){
          let Id=this.$route.query.platformId;
           this.getData(Id);
        },
        methods: {
            getData(platformId){
                let self = this;
                self.$axios.get("/ccdproduct/platform/queryPlatformById.htm?platformId="+platformId).then((res) => {
          //self.$axios.get("http://172.20.15.22:5555/ccdproduct/platform/queryPlatformById?platformId="+platformId).then((res) => {
                       this.form.logurl=res.data.content.logoUrl;
                       if(res.data.content.isDisplay==true){ this.form.region="是";}
                       else { this.form.region="否"; }
                      // console.log(this.form.region);
                       this.form.name=res.data.content.platformName;
                       this.form.Id=platformId;
                })
            },
            goTable(){
              this.$router.push({ path: 'tablelist'});
            },
            onUpdate(Id){
              this.$router.push({ path: 'tableupdate',query: { platformId: Id }});
            }
        }
    }
</script>
