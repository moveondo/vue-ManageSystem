<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 筛选条件详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称:">
                    <!-- <el-input v-model="form.name">{{form.name}}</el-input> -->
                    <div class="">
                      {{form.name}}
                    </div>
                </el-form-item>
                <el-form-item label="筛选属性:">
                    <!-- <el-input type="textarea" v-model="form.logUrl"></el-input> -->
                    <div class="">
                      {{form.attribute}}
                    </div>
                </el-form-item>
                <el-form-item label="筛选字段:">
                    <!-- <el-input type="textarea" v-model="form.logUrl"></el-input> -->
                    <div class="">
                      {{form.Column}}
                    </div>
                </el-form-item>
                <!-- <el-form-item label="排序类型:">
                    <div class="">
                      {{form.Type}}
                    </div>
                </el-form-item> -->
                <el-form-item label="是否展示:">
                    <div class="">
                      {{form.isDisplay}}
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onUpdate(form.Id)">更新筛选条件</el-button>
                    <el-button @click="goTable">返回筛选条件列表</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                url0:"/ccdproduct/product/queryAllProductAttributeType.htm",
                itemList:Array,
                cur_page: 1,
                form: {
                    name: '',
                    attribute: '',
                    Type: '',
                    Column:'',
                    isDisplay:''
                }
            }
        },
        created(){
           this.getDataQuery();
          let Id=this.$route.query.id;
           this.getData(Id);
        },
        methods: {
            getData(Id){
                let self = this;
                self.$axios.get("/ccdproduct/productFiltrate/queryPlatformById.htm?productFiltrateId="+Id).then((res) => {
                      let AttributeType=res.data.content.filtrateAttributeType;
                      let AttributeColumn=res.data.content.filtrateAttributeColumn;
                      this.form.name=res.data.content.productFiltrateName;
                      this.form.attribute=self.itemList[AttributeType];
                      this.form.Id=Id;

                      //this.form.Column=res.data.content.filtrateAttributeColumn;
                      if(AttributeColumn=="attribute_value"){ this.form.Column="属性值";}
                      else if(AttributeColumn=="max_value"){ this.form.Column="最大值";}
                      else { this.form.Column="最小值"; }

                      //  if(res.data.content.filtrateType==1){ this.form.Type="正序";}
                      //  else { this.form.Type="倒序"; }
                       if(res.data.content.display==true){ this.form.isDisplay="是";}
                       else { this.form.isDisplay="否"; }
                }).catch(function(err){
                   console.log("调用失败0",err)
                })
            },
            getDataQuery(){
                let self = this;
                self.$axios.post(self.url0, {}).then((res) => {
                    self.Content = res.data.content;

                    for(var i= 0,len=self.Content.length;i<len;i++){
                      var buteName = self.Content[i].attributeName;
                      var TypeId = self.Content[i].attributeTypeId;
                       self.itemList[TypeId] = buteName;
                    }

                }).catch(function(err){
                   console.log("调用失败",err)
                })
            },
            goTable(){
              this.$router.push({ path: 'filterlist'});
            },
            onUpdate(Id){
              this.$router.push({ path: 'filterupdate',query: { platformId: Id }});
            }
        }
    }
</script>
