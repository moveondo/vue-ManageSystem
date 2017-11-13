<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i>筛选</el-breadcrumb-item>
                <el-breadcrumb-item>筛选条件列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <table class="table" cellspacing="0px">
            <thead>
            <tr class="table-striped">
              <th>序号</th><th>名称</th><th>筛选属性</th><th>筛选字段</th><th>排序类型</th><th>是否展示</th><th>操作</th>
            </tr>
          </thead>
        <tbody>
        <tr class="tabele-td" v-cloak v-for="(item, index) of tableData">
          <td class="first">{{index+1}}</td>
          <td>{{item.filtrateName}}</td>
          <td >
              {{itemList[item.filtrateAttributeType] }}

          </td>
          <td>
            <div v-if="item.filtrateAttributeColumn=='attribute_value'">属性值</div>
            <div v-else-if="item.filtrateAttributeColumn=='max_value'"> 最大值</div>
            <div v-else> 最小值 </div>
          </td>
          <td>
            <div v-if="item.filtrateType==1">正序</div>
            <div v-else> 倒序 </div>
          </td>
          <td>
            <div v-if="item.isDisplay==true">是</div>
            <div v-else> 否 </div>
           </td>
          <td class="dis">
              <span class="el-button el-button--default el-button--small"   @click="handleRead(index,item.id)">查看</span>
              <span class="el-button el-button--default el-button--small"   @click="handleEdit(index,item.id)">编辑</span >
          </td>
        </tr>
      </tbody>
     </table>

        <div class="pagination">
            <!-- <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination> -->
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
                //url0:"http://172.20.15.22:5555/ccdproduct/product/queryAllProductAttributeType",
                url0:"/ccdproduct/product/queryAllProductAttributeType.htm",
                tableData: [],
                itemList:Array,
                cur_page: 1,
                currentPage1:1,
                totalNum:0,
                pageSize:0,
            }
        },
        created(){
            this.getData();
            this.getDataQuery();
        },
        mounted: function(){

        },
        methods: {
          handleCurrentChange(val){
              this.cur_page = val;
              this.getData();
          },
          handleSizeChange(val) {

           console.log(`每页 ${val} 条`);
         },
          getData(){
              let self = this;
              self.$axios.post("/ccdproduct/productFiltrate/queryPlatform.htm",
              //self.$axios.post("http://172.20.15.22:5555/ccdproduct/productFiltrate/queryPlatform",
               {startPage:self.cur_page}).then((res) => {
                  self.tableData = res.data.content.list;
                  self.totalNum=res.data.content.totalCount;
                  self.pageSize=res.data.content.pageSize;

              }).catch(function(err){
                 console.log("调用失败",err)
              })
          },
          getDataQuery(){
              let self = this;
              self.$axios.post(self.url0).then((res) => {
                  self.Content = res.data.content;
                 //alert(self.Content.length)
                  for(var i= 0,len=self.Content.length;i<len;i++){

                    var buteName = self.Content[i].attributeName;
                    var TypeId = self.Content[i].attributeTypeId;
                  //  alert(buteName)
                     self.itemList[TypeId] = buteName;
                  }

              }).catch(function(err){
                 console.log("调用失败",err)
              })
          },


          handleRead(index,id){
            //this.$message('查看'+(index+1)+'行');
            this.$router.push({ path: 'filtersiglelist', query: { id: id }});
          },
          handleEdit(index, id) {
              //this.$message('编辑第'+(index+1)+'行');
              this.$router.push({ path: 'filterupdate',query: { platformId: id }});
          },
          handleDelete(index, row) {
              this.$message.error('删除第'+(index+1)+'行');
          },
          handleSelectionChange(val) {
              this.multipleSelection = val;
          }
        }
    }
</script>

<style scoped>
.table{
  width: 100%;
  text-align: left;
  line-height: 30px;
  box-sizing: border-box;
  position: relative;
  font-size: 14px;
  table-layout : fixed;

}
.table td,.table th{
  height: 40px;
  min-width: 0;
  text-overflow: ellipsis;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  padding-left: 18px;
    padding-right: 18px;

}
.table-striped th{
  white-space: nowrap;
  overflow: hidden;
  background-color: #eef1f6;
  text-align: left;
  border: 0.5px solid #dfe6ec;
}
.first{
  border-left: 1px solid #dfe6ec;
}
.table td{
border-right: 1px solid #dfe6ec;
border-bottom: 1px solid #dfe6ec
}
.table-striped th{
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  white-space: nowrap;
overflow: hidden;
background-color: #eef1f6;
text-align: left;
}
/*.dis{
  display: flex;
}*/

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
</style>
