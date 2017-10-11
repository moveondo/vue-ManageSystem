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
               <tr :model="interestRate">
                 <td>年化利率：</td>
                 <td>  <el-input v-model="interestRate.attributeValue"></el-input> </td>
                 <td> <el-input v-model="interestRate.maxValue"></el-input> </td>
                 <td> <el-input v-model="interestRate.minValue"></el-input> </td>
               </tr>
               <tr :model="loanPeriod">
                 <td>借款期限：</td>
                 <td> <el-input v-model="loanPeriod.attributeValue"></el-input></td>
                 <td> <el-input v-model="loanPeriod.maxValue"></el-input></td>
                 <td> <el-input v-model="loanPeriod.minValue"></el-input></td>
               </tr>
               <tr :model="quota">
                 <td>额  度：</td>
                 <td> <el-input v-model="quota.attributeValue"></el-input></td>
                 <td> <el-input v-model="quota.maxValue"></el-input> </td>
                 <td> <el-input v-model=" quota.minValue"></el-input> </td>
               </tr>
               <tr :model="loanTime">
                 <td>放款时长：</td>
                 <td> <el-input v-model="loanTime.attributeValue"></el-input></td>
                 <td> <el-input v-model="loanTime.maxValue"></el-input> </td>
                 <td> <el-input v-model="loanTime.minValue"></el-input></td>
               </tr>
             </tbody>
           </table>
           <div class="btn">
             <el-button type="primary" @click="onUpdate">更新</el-button>
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
                Properties:[],
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
            this.getDataQuery(Id);
        },
        methods: {
            onUpdate() {
              var ProductId=this.$route.query.productId;

                let RateA=this.interestRate.attributeValue;
                let RateMax=this.interestRate.maxValue;
                let RateMin=this.interestRate.minValue;

                let loanPeriodA=this.loanPeriod.attributeValue;
                let loanPeriodMax=this.loanPeriod.maxValue;
                let loanPeriodMin=this.loanPeriod.minValue;

                let quotaA=this.quota.attributeValue;
                let quotaMax=this.quota.maxValue;
                let quotaMin=this.quota.minValue;

                let loanTimeA=this.loanTime.attributeValue;
                let loanTimeMax=this.loanTime.maxValue;
                let loanTimeMin=this.loanTime.minValue;

                if(RateA=='' || RateMax=='' || RateMin=='') {
                  this.$message.error('请填写年化利率属性值/最大值/最小值');
                  return false;
                }else if (loanPeriodA=='' || loanPeriodMax=='' || loanPeriodMin=='' ){
                  this.$message.error('请填写借款期限属性值/最大值/最小值');
                  return false;
                }else if (quotaA=='' || quotaMax=='' || quotaMin==''){
                  this.$message.error('请填写额度属性值/最大值/最小值');
                  return false;
                }else if (loanTimeA=='' || loanTimeMax=='' || loanTimeMin==''){
                  this.$message.error('请填写放款时长属性值/最大值/最小值');
                  return false;
                }

                let params=[
                  {"attributeType":1,"attributeValue":RateA,"maxValue":RateMax,"minValue":RateMin,"isactive":true,"productId":ProductId },
                  {"attributeType":3,"attributeValue":loanPeriodA,"maxValue":loanPeriodMax,"minValue":loanPeriodMin,"isactive":true,"productId":ProductId },
                  {"attributeType":2,"attributeValue":quotaA,"maxValue":quotaMax,"minValue":quotaMin,"isactive":true,"productId":ProductId },
                  {"attributeType":4,"attributeValue":loanTimeA,"maxValue":loanTimeMax,"minValue":loanTimeMin,"isactive":true,"productId":ProductId }
                ]
                 this.UpdateData(params,ProductId);
            },

            getDataQuery(Id){
              let self = this;
              self.$axios.get("/ccdproduct/product/queryProductById.htm?productId="+Id).then((res) => {
                  this.interestRate=res.data.content.attributes.interestRate;
                  this.loanPeriod=res.data.content.attributes.loanPeriod;
                  this.quota=res.data.content.attributes.quota;
                  this.loanTime=res.data.content.attributes.loanTime;

              }).catch(function(err){
                 console.log("调用失败0",err)
              })
            },
            UpdateData(params,ProductId){
                let self = this;
                self.$axios.post(self.url, params).then((res) => {
                    this.$message.success('更新成功！');
                     this.$router.push({ path: 'productsiglelist',query: { productId: ProductId }});
                }).catch(function(err){
                   console.log("调用失败2",err)
                })
            },
            onCancel(){
              this.interestRate.attributeValue='';
              this.interestRate.maxValue='';
              this.interestRate.minValue='';
              this.loanPeriod.attributeValue='';
              this.loanPeriod.maxValue='';
              this.loanPeriod.minValue='';
              this.quota.attributeValue='';
              this.quota.maxValue='';
              this.quota.minValue='';
              this.loanTime.attributeValue='';
              this.loanTime.maxValue='';
              this.loanTime.minValue='';

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
