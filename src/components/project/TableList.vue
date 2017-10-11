<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>平台</el-breadcrumb-item>
                <el-breadcrumb-item>平台列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量不展示</el-button> -->
            <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                <el-option key="1" label="广东省" value="广东省"></el-option>
                <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select> -->
            <el-input v-model="select_word" placeholder="筛选关键词" ref="input" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <span class="radio">
              <input type="radio" id="yes" value="true"  v-model="picked" @click="Front"><label for="yes">在客户端显示</label>
              <input type="radio" id="no"  value="false" v-model="picked" @click="Front"><label for="no">不在客户端显示</label>
            </span>

        </div>
        <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column data-index="{{index}}" label="序号" v-on:click="onclick" sortable width="150"></el-table-column> -->
            <el-table-column  prop="index"  label="序号" sortable width="150" >  </el-table-column>
            <el-table-column prop="platformName" label="平台名称" :formatter="formatter"></el-table-column>
            <el-table-column prop="logoUrl" label="logo地址"  :logUrl="logUrl"></el-table-column>
            <el-table-column label="操作" width="180">
             <template scope="scope">
                  <el-button size="small"
                          @click="handleRead(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small"
                          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button size="small" type="danger"
                          @click="handleDelete(scope.$index, scope.row)">不展示</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url:"/ccdproduct/platform/queryPlatform.htm",
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                picked:''
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                  //  alert(self.del_list.length)
                    for (let i = 0; i < self.del_list.length; i++) {

                        if(d.platformName === self.del_list[i].platformName){
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
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                self.$axios.post(self.url, {startPage:self.cur_page}).then((res) => {
                    self.tableData = res.data.content.list;
                })
            },
            queryData(InputValue){
                let self = this;
                self.$axios.post(self.url, {platformName:InputValue}).then((res) => {
                    self.tableData = res.data.content.list;

                })
            },
            queryDataFront(Pick){
                let self = this;
                self.$axios.post(self.url, {display:Pick}).then((res) => {
                    self.tableData = res.data.content.list;
                })

            },
            search(){
                this.is_search = true;
                let InputValue=this.$refs.input.value;
                this.queryData(InputValue);
            },
            Front(){
                let Pick=this.picked;
                this.queryDataFront(Pick);
            },
            index(row, column){
                return row.index;
            },
            logUrl(row, column){
              return row.logUrl;
            },
            formatter(row, column) {
              //console.log($index);
                return row.platformName;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleRead(index,row){
                //this.$message('查看'+(index+1)+'行');
                this.$router.push({ path: 'tablesiglelist', query: { platformId: row.id }});
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
                this.$router.push({ path: 'tableupdate', query: { platformId: row.id }});
            },
            // handleDelete(index, row) {
            //   //  this.$message.error('删除第'+(index+1)+'行');
            // },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
.radio{
display: inline-block;
  margin-left: 50px;
  font-style: normal;
}
</style>
