<template>
 <div>
   <el-dialog title="用户信息" :visible.sync="dialogVisible">
     <el-form :model="form">
       <el-form-item label="地址" :label-width="formLabelWidth">
         <el-input v-model="form.address" auto-complete="off"></el-input>
       </el-form-item>
       <el-form-item label="姓名" :label-width="formLabelWidth">
         <el-input v-model="form.name" auto-complete="off"></el-input>
       </el-form-item>
       <el-form-item label="日期" :label-width="formLabelWidth">
         <el-date-picker v-model="form.date" type="date" placeholder="选择日期">
         </el-date-picker>
       </el-form-item>

       <el-form-item label="性别" :label-width="formLabelWidth">
         <el-select v-model="form.region" placeholder="性别">
           <el-option label="男" value="男"></el-option>
           <el-option label="女" value="女"></el-option>
         </el-select>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="cancel">取 消</el-button>
       <el-button type="primary" @click="update">确 定</el-button>
     </div>
   </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
   props: ['dialogVisible','form','currentIndex'],
   data: function () {
          return {
           form1:this.form,
           form:{},
           formLabelWidth: '80px',
           dialogVisible1: this.dialogVisible,
          };
        },
		methods: {
		   Relocation(){
                  this.dialogVisible1=false;
                  this.$router.push('/readme');
       },
       handleClose(){
        this.$confirm('确认关闭？')
            .then(_ => {
               this.Relocation();
            })
            .catch(_ => {});
        },
        update() {

       },
      cancel() {
       this.dialogVisible = false;
       },
		}
	}
</script>
