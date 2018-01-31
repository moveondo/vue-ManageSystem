<template>
 <div>
     <el-dialog
            title="提示(Catatan)"
            :visible.sync="dialogVisible1"
            width="30%"
            :before-close="handleClose">
            <span>您无此权限(Anda tidak mendapat izin)</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="Relocation">取 消(Batal)</el-button>
                <el-button type="primary" @click="Relocation">确 定(OK)</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
         props: ['dialogVisible'],
         data: function () {
          return {
           dialogVisible1: this.dialogVisible,  
          };
        },
		methods: {
		   Relocation(){
                  this.dialogVisible1=false;
                  this.$router.push('/readme'); 
           },
           handleClose(){             
            this.$confirm('确认关闭(Konfirmasi menutup)？')
                .then(_ => {             
                   this.Relocation();                
                })
                .catch(_ => {});
            }, 
		}
	}
</script>