<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 产品</el-breadcrumb-item>
                <el-breadcrumb-item>更新产品属性</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
          <!-- 手动添加 -->
          <div class="message">
            <table class="table">
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
             <el-button type="primary" @click="onUpdate()">更新</el-button>
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
                // url:"http://172.20.15.22:5555/ccdproduct/product/saveOrUpdateProductAttributes",
                // url0:"http://172.20.15.22:5555/ccdproduct/product/queryAllProductAttributeType",
                url:"/ccdproduct/product/saveOrUpdateProductAttributes.htm",
                url0:"/ccdproduct/product/queryAllProductAttributeType.htm",

                Properties:[],
                Type:[],
                Type0:[],
                TypeCode:[],
                arr:[],
                params:[],

            }
        },
        created(){

            let Id=this.$route.query.productId;
            this.getQuery(Id);
            //this.getDataQuery(Id);

        },
        methods: {
           getQuery(Id){
              let self = this;
              self.$axios.post(self.url0).then((res) => {
                  self.Properties=res.data.content;
                  let TypeLength=self.Properties.length;
                  for (let i = 0; i < TypeLength; i++) {
                    self.Type[self.Properties[i].attributeTypeId]=self.Properties[i].attributeName;
                    self.Type0[i]=self.Properties[i].attributeTypeId;
                    self.TypeCode[i]=self.Properties[i].attributeCode;

                  };
                    let Id=this.$route.query.productId;
                    this.getDataQuery(Id);
                //console.log(self.TypeCode[0]);
              })
           },
           getDataQuery(Id){
             let self = this;
             self.$axios.get("/ccdproduct/product/queryProductById.htm?productId="+Id).then((res) => {
          //   self.$axios.get("http://172.20.15.22:5555/ccdproduct/product/queryProductById?productId="+Id).then((res) => {

               self.arr=res.data.content.attributes;
               for(var key in self.arr)
                  {
                    self.params.push({"attributeType":self.arr[key].attributeType,"attributeValue":self.arr[key].attributeValue,"maxValue":self.arr[key].maxValue,"minValue":self.arr[key].minValue,"isactive":true,"productId":Id,"productAttributeId":self.arr[key].productAttributeId })
                  }
              // console.log(self.params[0].attributeType);
               //console.log(self.Type0);

               //console.log("长度："+self.params.length);
               let paramsLength=self.params.length;
               for(let i=paramsLength+1;i<=self.Type0.length;i++){
                  self.params.push({"attributeType":i,"attributeValue":"","maxValue":"","minValue":"","isactive":true,"productId":Id,"productAttributeId":"" })
               }
               //self.params.sort();
               self.params.sort(function(a,b){
              		return a.attributeType - b.attributeType;
              })



             }).catch(function(err){
                console.log("调用失败0",err)
             })
           },
            onUpdate() {
              var ProductId=this.$route.query.productId;
                 this.UpdateData(this.params,ProductId);
            },
            UpdateData(params,ProductId){
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
        width: 600px;
  }
  .table{
    text-align: center;
    font-size: 14px;
        width: 100%;

  }
  .table td, .table th{
   width: 25%;
    line-height: 43px;
  }
  .btn{
    text-align: center;
    margin-top: 50px;
  }
</style>
