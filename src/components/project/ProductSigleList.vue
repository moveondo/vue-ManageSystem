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
                     <tr :model="interestRate">
                       <td>年化利率：</td>
                       <td>{{ interestRate.attributeValue}}</td>
                       <td>{{ interestRate.maxValue}} </td>
                       <td>{{ interestRate.minValue}} </td>
                     </tr>
                     <tr :model="loanPeriod">
                       <td>借款期限：</td>
                       <td>{{ loanPeriod.attributeValue}}</td>
                       <td>{{ loanPeriod.maxValue}} </td>
                       <td>{{ loanPeriod.minValue}} </td>
                     </tr>
                     <tr :model="quota">
                       <td>额  度：</td>
                       <td>{{ quota.attributeValue}}</td>
                       <td>{{ quota.maxValue}} </td>
                       <td>{{ quota.minValue}} </td>
                     </tr>
                     <tr :model="loanTime">
                       <td>放款时长：</td>
                       <td>{{ loanTime.attributeValue}}</td>
                       <td>{{ loanTime.maxValue}} </td>
                       <td>{{ loanTime.minValue}} </td>
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
                form: {
                    platformName: '',
                    productName: '',
                    IsDisplay: '',
                    productUrl:'',
                    productPresentation:'',
                },
                interestRate:{
                  attributeValue:'',
                  maxValue:'',
                  minValue:''
                },
                loanPeriod:{
                  attributeValue:'',
                  maxValue:'',
                  minValue:''
                },
                quota:{
                  attributeValue:'',
                  maxValue:'',
                  minValue:''
                },
                loanTime:{
                  attributeValue:'',
                  maxValue:'',
                  minValue:''
                }
            }
        },
        created(){
          let Id=this.$route.query.productId;
           this.getData(Id);
        },
        methods: {
            getData(Id){
                let self = this;
                self.$axios.get("/ccdproduct/product/queryProductById.htm?productId="+Id).then((res) => {
                     let IsDisplay=res.data.content.isDisplay;

                       if(IsDisplay==true){  this.form.IsDisplay='是';}
                       else if(IsDisplay==false) { this.form.IsDisplay='否'; }

                       console.log(IsDisplay,this.form.IsDisplay);
                       this.form.platformName=res.data.content.platformName;
                       this.form.productName=res.data.content.productName;
                       this.form.productName=res.data.content.productName;
                       this.form.productUrl=res.data.content.productUrl;
                       this.form.productPresentation=res.data.content.productPresentation;
                       this.form.Id=Id;

                       let  AttriButes=res.data.content.attributes;
                       //利率
                       if(AttriButes && res.data.content.attributes.interestRate){
                         this.interestRate.attributeValue=res.data.content.attributes.interestRate.attributeValue;
                         this.interestRate.maxValue=res.data.content.attributes.interestRate.maxValue;
                         this.interestRate.minValue=res.data.content.attributes.interestRate.minValue;
                       }

                       //借款期限
                       if(AttriButes && res.data.content.attributes.loanPeriod){
                         this.loanPeriod.attributeValue=res.data.content.attributes.loanPeriod.attributeValue;
                         this.loanPeriod.maxValue=res.data.content.attributes.loanPeriod.maxValue;
                         this.loanPeriod.minValue=res.data.content.attributes.loanPeriod.minValue;
                       }

                       //额度
                       if(AttriButes && res.data.content.attributes.quota){
                         this.quota.attributeValue=res.data.content.attributes.quota.attributeValue;
                         this.quota.maxValue=res.data.content.attributes.quota.maxValue;
                         this.quota.minValue=res.data.content.attributes.quota.minValue;
                       }

                       //放款时长
                       if(AttriButes && res.data.content.attributes.loanTime){
                         this.loanTime.attributeValue=res.data.content.attributes.loanTime.attributeValue;
                         this.loanTime.maxValue=res.data.content.attributes.loanTime.maxValue;
                         this.loanTime.minValue=res.data.content.attributes.loanTime.minValue;
                       }

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
