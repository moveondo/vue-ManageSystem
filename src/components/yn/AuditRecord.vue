<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i>审核</el-breadcrumb-item>
                <el-breadcrumb-item>listing审核记录 (Catatan audit)</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tag">
            <el-button type="success" @click="queryData('process')">审核过程 (Proses audit)</el-button>
            <el-button type="success" @click="queryData('result')">审核结论(Kesimpulan audit)</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" :row-class-name="tableRowClassName" :class="{ 'class-showA': showA}">
            <el-table-column type="index" :index="indexMethod" label="序号(Nomor urutan)" width="140"> </el-table-column>
            <el-table-column prop="listingId" label="listingId" width="100"></el-table-column>
            <el-table-column prop="auditName" label="操作人(Operator)" width="140"></el-table-column>
            <el-table-column prop="operate" label="类别(Kategori)" width="140">
                <template slot-scope="scope">
                    <div v-if="scope.row.operate=='1'">
                         电核(Verifikasi telepon)
                    </div>
                    <div  v-else-if="scope.row.operate=='2'">
                         分配审核owner(Tentukan auditor)
                    </div>
                    <div v-else-if="scope.row.operate=='3'">
                         一审通过(Audit pertama terlewati)
                    </div>
                    <div v-else-if="scope.row.operate=='4'">
                         二审通过(Audit kedua terlewati)
                    </div>
                    <div  v-else-if="scope.row.operate=='5'">
                         审核拒绝(Penolakan audit)
                    </div>
                    <div v-else>
                        其他
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="inserttime" :formatter="timetrans" label="操作时间(Waktu operasi)" width="190"></el-table-column>
            <el-table-column prop="auditContent" label="详细内容(Rincian)"></el-table-column>
        </el-table>
        
        <el-table :data="data1" border style="width: 100%" :row-class-name="tableRowClassName" :class="{ 'class-showB': showB}">
            <el-table-column type="index" :index="indexMethod" label="序号(Nomor urutan)" width="140"> </el-table-column>
            <el-table-column prop="listingId" label="listingId" width="140"></el-table-column>
            <el-table-column prop="auditName" label="操作人(Operator)" width="140"></el-table-column>
            <el-table-column prop="operate" label="类别(Kategori)" width="140">
                <template slot-scope="scope">
                    <div v-if="scope.row.operate=='1'">
                        电核(Verifikasi telepon)
                    </div>
                    <div v-else-if="scope.row.operate=='2'">
                        分配审核owner(Tentukan auditor)
                    </div>
                    <div v-else-if="scope.row.operate=='3'">
                        一审通过(Audit pertama terlewati)
                    </div>
                    <div v-else-if="scope.row.operate=='4'">
                        二审通过(Audit kedua terlewati)
                    </div>
                    <div v-else-if="scope.row.operate=='5'">
                        审核拒绝(Penolakan audit)
                    </div>
                    <div v-else>
                        其他
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="inserttime" :formatter="timetrans" label="操作时间(Waktu operasi)" width="190"></el-table-column>
            <el-table-column prop="auditContent" label="详细内容(Rincian)"></el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next" :total="totalNum">
            </el-pagination>
        </div>
        <verifyPermission></verifyPermission>

    </div>
</template>

<script>

    import verifyPermission from './Permission.vue';
    export default {
        data() {
            return {
                 url: "/backend/IListingAuditFlowLogService/getListingAuditFlowLogList",
                //url: "//172.20.14.33:8080/backend/IListingAuditFlowLogService/getListingAuditFlowLogList",
                username: '',
                AuditData: [],
                LogData:[],
                currentPage: 1,
                totalNum: 0,
                pageSize: 20,
                cur_page: 1,
                showA:true,
                showB:false,
                Type1:'process'
               
            };
        },
        components: {
            'verifyPermission': verifyPermission,
        },
        created() {
            
            this.queryData('process');

        },
        computed: {
            data() {
                const self = this;
                if (self.AuditData === null) {
                    return self.AuditData;
                } else {
                    return self.AuditData.filter(function (d) {
                        return d;
                    })
                }
            },
            data1() {
                const self = this;
                if (self.LogData === null) {
                    return self.LogData;
                } else {
                    return self.LogData.filter(function (d) {
                        return d;
                    })
                }
            }

        },
        methods: {
            indexMethod(index) {
                return (index + 1) + (this.cur_page - 1) * this.pageSize;
            },
            handleSizeChange(val) {

                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                let self = this;
                this.cur_page = val;
              
                self.queryData(self.Type1);
            },
            tableRowClassName(row, index) {
                row.index = (index + 1) + (this.cur_page - 1) * this.pageSize;
            },
            queryData(type) {
               
                let self = this;
                let operateList;
                let userId = this.$route.query.userId;
                let listingId = this.$route.query.listingId;
                self.AuditData=Array();
                self.LogData = Array();
                self.Type1 = type;
                if(type=="process"){
                   
                    operateList=[1,2];
                      self.showA = false;
                    self.showB = true;
                  
                }else{
                    
                    operateList=[3,4,5];
                      self.showA = true;
                    self.showB = false;
                   
                }
                self.$axios.post(self.url, { "userId": userId, "operateList": operateList, "listingId": listingId,"startPage": self.cur_page, "pageSize": self.pageSize }).then((res) => {
                    if (res.data.result == "0") {

                         if (type == "process") {
                            self.AuditData = res.data.content.list;
                        } else {
                            self.LogData = res.data.content.list;
                        }

                       
                        self.totalNum = res.data.content.totalCount;
                        self.pageSize = res.data.content.pageSize;

                    } else if (res.data.result == '-99' || res.data.result == '-999') {
                        self.$message.error(res.data.resultMessage);
                    } else {
                        self.$message.error(res.data.resultMessage);
                    }

                })
            },
            timetrans: function (row, column) {
                var date = row[column.property];
                var date = new Date(date);//如果date为13位不需要乘1000
                if (date == undefined) {
                    return "";
                }
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return Y + M + D + h + m + s;
            }
        }
    }
</script>

<style scoped>

    .class-showB,.class-showA{
        display: none;
    }
    .tag{
        margin-bottom: 25px;
    }
</style>