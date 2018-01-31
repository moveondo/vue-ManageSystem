<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 筛选条件</el-breadcrumb-item>
                <el-breadcrumb-item>创建筛选条件</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="180px">
              <el-form-item label="名称">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item  label="筛选属性">
                <el-select v-model="form.selected" placeholder="请选择">
                  <el-option v-for="(item, index) of Properties"  :key="item.attributeName" :label="item.attributeName" :value="item.attributeTypeId"></el-option>
                </el-select>
               </el-form-item>

                  <el-form-item label="筛选字段">
                      <el-select v-model="form.fields" placeholder="请选择">
                        <el-option v-for="(item, index) of fieldsValue" :key="item.lable" :label="item.lable" :value="item.value"></el-option>
                      </el-select>
                  </el-form-item>
                <el-form-item label="排序类型">
                    <el-select v-model="form.sort" placeholder="请选择">
                        <el-option key="bbk" label="正序" :value="1"> </el-option>
                        <el-option key="xtc" label="倒序" :value="2"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否在客户端展示">
                    <el-select v-model="form.client" placeholder="请选择">
                        <el-option key="xtc" label="是" :value="true"> </el-option>
                        <el-option key="xtc" label="否" :value="false"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
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
                 url:"/ccdproduct/productFiltrate/updateProductFiltrate.htm",
                 url0:"/ccdproduct/product/queryAllProductAttributeType.htm",//查询筛选属性
                 //url:"http://172.20.15.22:5555/ccdproduct/productFiltrate/updateProductFiltrate",
                 //url0:"http://172.20.15.22:5555/ccdproduct/product/queryAllProductAttributeType",//查询筛选属性
                Properties:[],
                form: {
                    name: '',
                    selected: '',
                    fields: '',
                    sort:'',
                    client:''
                },
                fieldsValue:[
                  {
                    lable:'属性值',
                    value:'attribute_value'
                  },{
                    lable:'最大值',
                    value:'max_value'
                  },{
                    lable:'最小值',
                    value:'min_value'
                  }
                ]
            }
        },
      async created(){

          this.getDataQuery();
          let Id=this.$route.query.platformId;
          this.getDataQueryName(Id);
        },
        methods: {
            onSubmit() {
                let Name=this.form.name;
                let Selected=this.form.selected;
                let Fields=this.form.fields;
                let Sort=this.form.sort;
                let Client=this.form.client;
                let Id=this.form.Id;//增加ID

                if(Name=='') {
                  this.$message.error('请填写筛选条件名称');
                  return false;
                }
                this.getData(Name,Selected,Fields,Sort,Client,Id);
            },
            getDataQueryName(Id){
              let self = this; //
              self.$axios.get("/ccdproduct/productFiltrate/queryPlatformById.htm?productFiltrateId="+Id).then((res) => {
            //  self.$axios.get("http://172.20.15.22:5555/ccdproduct/productFiltrate/queryPlatformById?productFiltrateId="+Id).then((res) => {
                  this.form.name=res.data.content.productFiltrateName;
                  this.form.client=res.data.content.display;
                  this.form.fields=res.data.content.filtrateAttributeColumn;
                  this.form.selected=res.data.content.filtrateAttributeType;
                  this.form.sort=res.data.content.filtrateType;

                  this.form.Id=Id;

              }).catch(function(err){
                 console.log("调用失败0",err)
              })
            },
            getDataQuery(){
                let self = this;
                self.$axios.post(self.url0,{}).then((res) => {
                    self.Properties=res.data.content;

                    //console.log(this.Properties);
                }).catch(function(err){
                   console.log("调用失败1",err)
                })
            },
            getData(Name,Selected,Fields,Sort,Client,Id){
                let self = this;
                self.$axios.post(self.url, {"filtrateName":Name,"filtrateAttributeType":Selected,
                  "filtrateAttributeColumn":Fields,"filtrateType":Sort,"display":Client,"filtrateId":Id }).then((res) => {
                    this.$message.success('更新成功！');
                    this.form.name='';
                    this.form.selected='';
                    this.form.fields='';
                    this.form.sort='';
                    this.form.client='';
                    this.$router.push({ path: 'filtersiglelist',query: { id: Id }});
                }).catch(function(err){
                   console.log("调用失败2",err)
                })
            },
            onCancel(){
              this.form.name='';
              this.form.properties='';
              this.form.fields='';
              this.form.sort='';
              this.form.client='';
            }
        }
    }
</script>
