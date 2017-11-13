  <template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 产品详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="平台名称">
                    <div class="">
                      {{form.platformName}}
                    </div>
                </el-form-item>
                <el-form-item label="产品名称">
                    <div class="">
                      {{form.productName}}
                    </div>
                </el-form-item>
                <el-form-item label="是否展示">
                    <div class="">
                      {{form.IsDisplay}}
                    </div>
                </el-form-item>
                <el-form-item label="访问地址">
                    <div class="">
                      {{form.productUrl}}
                    </div>
                </el-form-item>
                <el-form-item label="申请材料">
                    <div class="">
                      {{form.productPresentation}}
                    </div>
                </el-form-item>
                <!-- 手动添加 -->
                <div class="message">
                  <table class="table table-striped table-bordered">
                   <thead>
                   <tr>
                       <th>名称</th>
                       <th>属性值</th>
                       <th>属性最大值</th>
                       <th>属性最小值</th>
                   </tr>
                   </thead>
                   <tbody>
                     <tr v-for="(item, index) of params" >
                       <td>{{Type[item.attributeType]}}</td>
                       <td>
                         {{item.attributeValue}}

                       </td>
                       <td> {{item.maxValue}}</td>
                       <td> {{item.minValue}} </td>
                     </tr>
                   </tbody>
                 </table>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="onUpdate(form.Id)">更新产品信息</el-button>
                    <el-button @click="goTable">返回产品列表</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
              //url0:"http://172.20.15.22:5555/ccdproduct/product/queryAllProductAttributeType",
              url0:"/ccdproduct/product/queryAllProductAttributeType.htm",
              arr:[],
              params:[],
              Properties:[],
              Type:[],
                form: {
                    platformName: '',
                    productName: '',
                    IsDisplay: '',
                    productUrl:'',
                    productPresentation:'',
                }
            }
        },
        created(){
            this.getQuery();
           let Id=this.$route.query.productId;
          //  this.getData(Id);
        },
        methods: {
          getQuery(){
             let self = this;
             self.$axios.post(self.url0).then((res) => {
                 self.Properties=res.data.content;
                 let TypeLength=self.Properties.length;
                 for (let i = 0; i < TypeLength; i++) {
                   self.Type[self.Properties[i].attributeTypeId]=self.Properties[i].attributeName;
                 };
              // console.log(self.Type[0]);
              let Id=this.$route.query.productId;
               this.getData(Id);
            });

          },
            getData(Id){
                let self = this;
                self.$axios.get("/ccdproduct/product/queryProductById.htm?productId="+Id).then((res) => {
                //self.$axios.get("http://172.20.15.22:5555/ccdproduct/product/queryProductById?productId="+Id).then((res) => {
                     let IsDisplay=res.data.content.isDisplay;

                       if(IsDisplay==true){  this.form.IsDisplay='是';}
                       else if(IsDisplay==false) { this.form.IsDisplay='否'; }

                       //console.log(IsDisplay,this.form.IsDisplay);
                       this.form.platformName=res.data.content.platformName;
                       this.form.productName=res.data.content.productName;
                       this.form.productName=res.data.content.productName;
                       this.form.productUrl=res.data.content.productUrl;
                       this.form.productPresentation=res.data.content.productPresentation;
                       this.form.Id=Id;

                       self.arr=res.data.content.attributes;
                       for(var key in self.arr)
                          {
                            //console.log(key+":"+self.arr[key].attributeType);
                            self.params.push({"attributeType":self.arr[key].attributeType,"attributeValue":self.arr[key].attributeValue,"maxValue":self.arr[key].maxValue,"minValue":self.arr[key].minValue,"isactive":true,"productId":Id,"productAttributeId":self.arr[key].productAttributeId })
                          }
                          self.params.sort(function(a,b){
                         		return a.attributeType - b.attributeType;
                         })
                })
            },
            goTable(){
              this.$router.push({ path: 'productlist'});
            },
            onUpdate(Id){
              this.$router.push({ path: 'productupdate',query: { productId: Id }});
            }
        }
    }
</script>
<style media="screen">
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
</style>
