<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 产品</el-breadcrumb-item>
                <el-breadcrumb-item>创建产品属性</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
          <!-- 手动添加 -->
          <div class="message">
            <table class="table table-striped table-bordered">
             <thead>
             <tr>
                 <th></th>
                 <th>属性值</th>
                 <th>属性最大值</th>
                 <th>属性最小值</th>
             </tr>
             </thead>
             <tbody>

               <tr v-for="(item, index) of params">
                 <td>{{Type[item.attributeType]}}</td>
                 <td>
                    <el-input v-model="item.attributeValue" ></el-input>
                 </td>
                 <td> <el-input v-model="item.maxValue"></el-input> </td>
                 <td> <el-input v-model="item.minValue"></el-input></td>
               </tr>
             </tbody>
           </table>
           <div class="btn">
             <el-button type="primary" @click="onSubmit()">保存</el-button>
             <el-button  @click="onCancel">取消</el-button>
           </div>

          </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                url:"/ccdproduct/product/saveOrUpdateProductAttributes.htm",
                //url:"http://172.20.15.22:5555/ccdproduct/product/saveOrUpdateProductAttributes",
                //url0:"http://172.20.15.22:5555/ccdproduct/product/queryAllProductAttributeType",
                url:"/ccdproduct/product/queryAllProductAttributeType.htm",
                Properties:[],
                Type:[],
                TypeCode:[],
                arr:[],
                params:[]
            }
        },
        created(){

            var ProductId=this.$route.query.productId;
          this.getQuery(ProductId);
        },
        methods: {
          getQuery(ProductId){
             let self = this;
             self.$axios.post(self.url0).then((res) => {
                 self.Properties=res.data.content;
                 let TypeLength=self.Properties.length;
                 for (let i = 0; i < TypeLength; i++) {
                   self.Type[self.Properties[i].attributeTypeId]=self.Properties[i].attributeName;
                   self.TypeCode[i]=self.Properties[i].attributeCode;
                self.params.push({"attributeType":self.Properties[i].attributeTypeId,"attributeValue":"","maxValue":"","minValue":"","isactive":true,"productId":ProductId,"productAttributeId":"" })

              };
               //console.log(self.params);
               self.params.sort(function(a,b){
                 return a.attributeType - b.attributeType;
              })
             })
          },
            onSubmit() {
              let ProductId=this.$route.query.productId;
                 this.createData(this.params,ProductId);
            },

            createData(params,ProductId){
                let self = this;

                for (var i = 0; i < params.length; i++) {
                     if(params[i].maxValue=="" || params[i].minValue=="" || params[i].attributeValue==""){
                         this.$message.error('所有字段都不能为空，请检查！');
                         return false;
                     }
                }
                self.$axios.post(self.url, params).then((res) => {
                     this.$message.success('更新成功！');
                     this.$router.push({ path: 'productsiglelist',query: { productId: ProductId }});
                }).catch(function(err){
                   console.log("调用失败2",err)
                })
            },
            onCancel(){
              let self = this;

              for (var i = 0; i < self.params.length; i++) {
                  self.params[i].maxValue="" ;
                  self.params[i].minValue="" ;
                  self.params[i].attributeValue="";
              }
            }
        }
    }
</script>
<style scoped>
  .message{
    margin-bottom: 50px;
  }
  .table{
    text-align: center;
    font-size: 14px;

  }
  .table td, .table th{
    width: 20%;
    line-height: 35px;
  }
  .btn{
    text-align: center;
    margin-top: 50px;
  }
</style>
