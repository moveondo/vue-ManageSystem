<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>报表</el-breadcrumb-item>
                <el-breadcrumb-item>转化率查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
              <el-date-picker
                v-model="dateVale"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>

            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <span class="radio">
              <input type="radio" id="ALL" :value="1" v-model="picked" @click="Front"><label for="ALL">全部</label>
              <input type="radio" id="yes" :value="2"  v-model="picked" @click="Front"><label for="yes">授权</label>
              <input type="radio" id="no"  :value="3" v-model="picked" @click="Front"><label for="no">未授权</label>
            </span>
            <el-button type="success" round @click="downloadDetail" class="downloadDetail">用户详情下载</el-button>
            <el-button type="success" round @click="downloadAll" class="downloadAll">全部下载</el-button>
            <el-button type="success" round @click="download" class="download">下载</el-button>
        </div>
        <div v-if="this.picked==2">
          <el-table :data="data"  border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable">
              <!-- <el-table-column  prop="index"  label="序号"  width="150" >  </el-table-column> -->
              <el-table-column fixed prop="registerDate" label="日期" ></el-table-column>
              <el-table-column prop="user" label="注册"  ></el-table-column>
              <el-table-column prop="aut" label="授权"  ></el-table-column>
              <el-table-column prop="autRate" label="转化率（授权/注册）"  ></el-table-column>
              <!-- <el-table-column prop="autInc" label="填写收入"  ></el-table-column>
              <el-table-column prop="autIncRate" label="转化率（收入/授权）"  ></el-table-column> -->
              <el-table-column prop="autIncTem" label="模板匹配"  ></el-table-column>
              <el-table-column prop="autIncTemRate" label="转化率（模板/收入）"  ></el-table-column>
              <el-table-column prop="autIncTemAna" label="有分析结果"  ></el-table-column>
              <el-table-column prop="autIncTemAnaRate" label="转化率（分析结果/匹配）"  ></el-table-column>
              <el-table-column prop="autBil" label="账单量（短信）"  ></el-table-column>
              <el-table-column prop="autBillCount" label="账单总量"  ></el-table-column>
          </el-table>
        </div>
        <div v-else-if="this.picked==3">
          <el-table :data="data"  border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable">
              <el-table-column prop="registerDate" label="日期"></el-table-column>
              <el-table-column prop="user" label="注册"  ></el-table-column>
              <el-table-column prop="nAut" label="未授权"  ></el-table-column>
              <el-table-column prop="nAutRate" label="转化率（未授权/注册）"  ></el-table-column>
              <!-- <el-table-column prop="nAutInc" label="填写收入"  ></el-table-column>
              <el-table-column prop="nAutIncRate" label="转化率（收入/未授权）"  ></el-table-column> -->
              <el-table-column prop="nAutBil" label="账单量（短信）"  ></el-table-column>
              <el-table-column prop="nAutBillCount" label="账单总量"  ></el-table-column>
          </el-table>
        </div>
        <div v-else-if="this.picked==1">
          <el-table :data="data"  border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable">
              <el-table-column prop="registerDate" label="日期"></el-table-column>
              <el-table-column prop="user" label="注册"  ></el-table-column>
              <el-table-column prop="bil" label="账单量（短信）"  ></el-table-column>
              <el-table-column prop="billCount" label="账单总量"  ></el-table-column>
              <el-table-column prop="bilUserRate" label="总体转化（账单/注册数）"  ></el-table-column>
              <el-table-column prop="avgBilCount" label="人均账单数（账单总量/注册数）"  ></el-table-column>
          </el-table>
         </div>
        <div class="pagination">
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page.sync="currentPage1"
                 :page-size="pageSize"
                 layout="total, prev, pager, next"
                 :total="totalNum">
           </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // url:"http://172.20.15.14:8181/ccdbackend/creditUserFeature/queryUserConvert.htm",
                // url0:"http://172.20.15.14:8181/ccdbackend/creditUserFeature/download.htm",
                url:"/ccdbackend/creditUserFeature/queryUserConvert.htm",
                url0:"/ccdbackend/creditUserFeature/download.htm",
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                is_search: false,
                picked:'1',
                currentPage1:1,
                totalNum:0,
                pageSize:0,
                pickerOptions2: {
                 shortcuts: [{
                   text: '最近一周',
                   onClick(picker) {
                     const end = new Date();
                     const start = new Date();
                     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                     picker.$emit('pick', [start, end]);
                   }
                 }, {
                   text: '最近一个月',
                   onClick(picker) {
                     const end = new Date();
                     const start = new Date();
                     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                     picker.$emit('pick', [start, end]);
                   }
                 }, {
                   text: '最近三个月',
                   onClick(picker) {
                     const end = new Date();
                     const start = new Date();
                     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                     picker.$emit('pick', [start, end]);
                   }
                 }]
               },
               dateVale: ''
            }
        },
        created(){
            //this.getData();
            this.queryData(this.cur_page);
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                  //  alert(self.del_list.length)
                    for (let i = 0; i < self.length; i++) {

                        if(d.user === self[i].user){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                            return d;
                    }
                })
            },

        },
        methods: {
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1)+(this.cur_page-1)*20;
           },
           handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
          },
            handleCurrentChange(val){
                this.cur_page = val;
                this.queryData(this.cur_page);
            },
            queryData(page,startDate,endDate,hasAuthorize){
                let self = this;
                self.$axios.post(self.url, {"currentPage":page,"beginDate":startDate,"endDate":endDate,"hasAuthorize":hasAuthorize,"orderByFields":['register_date desc']}).then((res) => {
                    self.tableData = res.data.content.list;
                    self.totalNum=res.data.content.totalCount;
                    self.pageSize=res.data.content.pageSize;
                }).catch(function(err){
                   console.log("查询调用失败",err)
                })
            },

            search(){
                 this.is_search = true;
                  let hasAuthorize;
                 let Picked=this.picked;
                 if(Picked==1){
                      hasAuthorize="";
                 }else if(Picked==2){
                     hasAuthorize=true;
                 }else{
                     hasAuthorize=false;
                 }
                 let startDate=this.formatDate(this.dateVale[0]);
                 let endDate=this.formatEndDate(this.dateVale[1]);

                  console.log("search:",this.dateVale[0],this.dateVale[1]);
                  this.queryData(this.cur_page,startDate,endDate,hasAuthorize);
            },
            Front(){
               let Picked=this.picked;
               let hasAuthorize;
               //console.log(Picked);
               if(Picked==1){
                   hasAuthorize="";
               }else if(Picked==2){
                   hasAuthorize=true;
               }else{
                   hasAuthorize=false;
               }

                  this.queryData(this.cur_page,this.dateVale[0],this.dateVale[1],hasAuthorize);
            },
            download(){

              let self = this;
              let Picked=this.picked;
              let hasAuthorize;
              //console.log(Picked);
              if(Picked==1){
                  hasAuthorize="";
              }else if(Picked==2){
                  hasAuthorize=true;
              }else{
                  hasAuthorize=false;
              }
           let startDate=self.formatDate(self.dateVale[0]);
           let endDate=self.formatEndDate(self.dateVale[1]);
          // console.log("startDate:"+startDate,"endDate:"+endDate);
           window.location.href="/ccdbackend/creditUserFeature/download.htm?currentPage="+this.cur_page+"&beginDate="+startDate+"&endDate="+endDate+"&hasAuthorize="+hasAuthorize;
          //window.location.href="http://172.20.15.14:8181/ccdbackend/creditUserFeature/download.htm?currentPage="+this.cur_page+"&beginDate="+startDate+"&endDate="+endDate+"&hasAuthorize="+hasAuthorize;
            },
            downloadAll(){
              let self = this;
              let Picked=this.picked;
              let hasAuthorize;
              //console.log(Picked);
              if(Picked==1){
                  hasAuthorize="";
              }else if(Picked==2){
                  hasAuthorize=true;
              }else{
                  hasAuthorize=false;
              }
           let startDate=self.formatDate(self.dateVale[0]);
           let endDate=self.formatEndDate(self.dateVale[1]);
           console.log("startDate:"+startDate,"endDate:"+endDate);
           window.location.href="/ccdbackend/creditUserFeature/download.htm?currentPage="+this.cur_page+"&beginDate="+startDate+"&endDate="+endDate+"&hasAuthorize="+hasAuthorize+"&downloadAll="+true;
           //window.location.href="http://172.20.15.14:8181/ccdbackend/creditUserFeature/download.htm?currentPage="+this.cur_page+"&beginDate="+startDate+"&endDate="+endDate+"&hasAuthorize="+hasAuthorize+"&downloadAll="+true;
         },
         downloadDetail(){
           let self = this;
           let Picked=this.picked;
           let hasAuthorize;
           //console.log(Picked);
           if(Picked==1){
               hasAuthorize="";
           }else if(Picked==2){
               hasAuthorize=true;
           }else{
               hasAuthorize=false;
           }

        let startDate=self.formatDate(self.dateVale[0]);
        let endDate=self.formatEndDate(self.dateVale[1]);

        window.location.href="/ccdbackend/creditUserFeatureDetail/download.htm?beginDate="+startDate+"&endDate="+endDate+"&hasAuthorize="+hasAuthorize+"&downloadAll="+true;
        //window.location.href="http://172.20.15.14:8181/ccdbackend/creditUserFeatureDetail/download.htm?beginDate="+startDate+"&endDate="+endDate+"&hasAuthorize="+hasAuthorize+"&downloadAll="+true;
         },
          index(row, column){
              return row.index;
          },
          formatDate (date) {
              if(date==undefined || date ==='') {return ""};
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              var d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              var h = date.getHours();
              h=h < 10 ? ('0' + h) : h;
              var minute = date.getMinutes();
              minute = minute < 10 ? ('0' + minute) : minute;
              var second=date.getSeconds();
              second=second < 10 ? ('0' + second) : second;
              return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
          },
          formatEndDate (date) {
                if(date==undefined || date ==='') {return ""};
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d+' '+"23:59:59";
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
.download{
  float: right;
  width: 70px;
  font-size: 16px;
  letter-spacing: 8px;
    padding: 10px 2px;
}
.downloadAll{
  float: right;
    width: 93px;
    font-size: 16px;
    letter-spacing: 2px;
    margin-left: 20px;
    padding: 10px 2px;
}
.downloadDetail{
  float: right;
  width: 111px;
  font-size: 16px;
  letter-spacing: 0px;
  margin-left: 15px;
  padding: 10px 1px;
}
.radio{
display: inline-block;
  margin-left: 50px;
  font-style: normal;
}
</style>
