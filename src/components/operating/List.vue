<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>文章</el-breadcrumb-item>
                <el-breadcrumb-item>文章列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
          板块名称：<el-select v-model="plate" placeholder="请选择">
            <el-option v-for="(item, index) of Plate"  :key="item.id"  :label="item.name" :value="item.id"></el-option>
          </el-select>
            标签：<el-select v-model="labels" placeholder="请选择">
              <el-option v-for="(Label, index) of Labels"  :key="Label.id"  :label="Label.name" :value="Label.id"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <span class="radio">
              <input type="radio" id="ALL" :value="1" v-model="isDisplay" @click="Front"><label for="ALL">已发布</label>
              <input type="radio" id="yes" :value="0"  v-model="isDisplay" @click="Front"><label for="yes">已保存(未发布)</label>
              <input type="radio" id="no"  :value="2" v-model="isDisplay" @click="Front"><label for="no">全部</label>
            </span>
        </div>
        <el-table :data="data"  border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable">
            <el-table-column prop="index" label="序号"  width="70" class-name="indexclass"></el-table-column>
            <el-table-column prop="articleTitle" label="标题" >
              <template scope="scope">
                <span > <router-link :to="{ path: '/readcontent',query:{id:scope.row.id}}">{{ scope.row.articleTitle }} </router-link> </span>
              </template>
            </el-table-column>
            <el-table-column prop="plateName" label="板块"  width="100" ></el-table-column>
            <el-table-column prop="labelNames" label="标签"  ></el-table-column>
            <el-table-column prop="publisher" label="发布人"   width="130"></el-table-column>
            <el-table-column prop="orderNum" label="权重" width="80" ></el-table-column>
            <el-table-column prop="inserttime" label="保存时间" :formatter="timetrans" ></el-table-column>
            <el-table-column prop="publishTime" label="发布时间" :formatter="timetrans" ></el-table-column>
            <el-table-column  label="是否展示" width="100">
             <template scope="scope">
               <span v-if="scope.row.isFrontDeskDisplay" type="text">是</span>
               <span v-else> 否 </span>
             </template>
            </el-table-column>
            <el-table-column label="操作">
             <template scope="scope">
               <!-- <el-button size="small" type="primary" @click="handleread(scope.$index, scope.row)">查看
               </el-button> -->
               <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">编辑
               </el-button>
               <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
               </el-button>
             </template>
         </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page.sync="currentPage"
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
                 url:"/IArticleService/articleList.htm",
                 url1:"/IPlateService/getAllplates.htm",
                 url2:"/IArticleService/deleteArticle.htm",
                 url3:"/IPlateService/getAllLabels.htm",
                 // url:"http://172.20.14.24:8080/IArticleService/articleList.htm",
                 // url1:"http://172.20.14.24:8080/IPlateService/getAllplates.htm",
                 // url2:"http://172.20.14.24:8080/IArticleService/deleteArticle.htm",
                 // url3:"http://172.20.14.24:8080/IPlateService/getAllLabels.htm",
                tableData: [],
                cur_page: 1,
                plate: '',
                Plate:[],
                Labels:[],
                labels:'',
                is_search: false,
                isDisplay:'2',
                currentPage:1,
                totalNum:0,
                pageSize:20,
            }
        },
        created(){
            this.getAllplates();
            this.getAllLabels();
            this.queryData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                            return d;
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
                let isDisplay=this.isDisplay;

                this.queryData(this.plate,this.cur_page,this.pageSize,this.labels,isDisplay);
            },
            getAllLabels(){
                let self = this;
                self.$axios.post(self.url3).then((res) => {
                    self.Labels = res.data.content.labelList;
                }).catch(function(err){
                   console.log("查询调用失败getAllplates",err)
                })

            },

            getAllplates(){
                let self = this;

                self.$axios.post(self.url1).then((res) => {
                    self.Plate = res.data.content.plateList;
                }).catch(function(err){
                   console.log("查询调用失败getAllplates",err)
                })

            },
            queryData(plateId,startPage,pageSize,labelIds,isDisplay){
                let self = this;
                self.tableData=[];
                self.$axios.post(self.url, {"plateId":plateId,"startPage":startPage,"pageSize":pageSize,"labelIds":labelIds,"isDisplay":isDisplay}).then((res) => {
                    self.tableData = res.data.content.articleList;
                    console.log(self.tableData);

                    // console.log(self.column);
                     self.totalNum=res.data.content.totalNum;
                    // self.pageSize=res.data.content.pageSize;
                }).catch(function(err){
                   console.log("查询调用失败",err)
                })
            },

            search(){
                 this.is_search = true;
                 let isDisplay=this.isDisplay;

                 this.queryData(this.plate,this.cur_page,this.pageSize,this.labels,isDisplay);
            },
            Front(){
               let isDisplay=this.isDisplay;
                this.queryData(this.plate,this.cur_page,this.pageSize,this.labels,isDisplay);
            },
          index(row, column){
              return row.index;
          },

          handleEdit(index, row) {
            let self = this;
            self.$router.push({ path: 'editcontent', query: { id: row.id }});
         },
          handleread(index, row){
           let self = this;
           self.$router.push({ path: 'readcontent', query: { id: row.id }});
          },
           handleDelete(index, row) {
           this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }).then(() => {
             this.$axios.post(this.url2, {"id":row.id}).then((res) => {
                 if(res.data.content=="success"){
                   this.queryData(this.plate,this.cur_page,this.pageSize,this.labels,this.isDisplay);
                   this.$message({
                     type: 'success',
                     message: '删除成功!'
                   })
                 }
             }).catch(function(err){
                console.log("查询调用失败",err)
             })

           }).catch(() => {
             this.$message({
               type: 'info',
               message: '已取消删除'
             })
           })
         },
          timetrans:function(row, column) {
             var date = row[column.property];
              var date = new Date(date);//如果date为13位不需要乘1000
              if (date == undefined) {
                  return "";
              }
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;
        },
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
.el-input{
    width: 200px;
    display: inline-block;
}
.indexclass{
  width: 70px;
}
.radio{
display: inline-block;
  margin-left: 50px;
  font-style: normal;
}
.cell-edit-color{
     color:#2db7f5;
     font-weight: bold;
 }
</style>
