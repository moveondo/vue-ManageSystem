<template>
 <div>
   
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
       
        data: function () {
          return {
           //url99:"http://172.20.14.33:8086/backend/IUserAuthService/verifyPermission",
           url99:"/backend/IUserAuthService/verifyPermission",
          };
        },
        created(){
                    
           var Path=(this.$route.path).replace("/",""); 
           this.verifyPermission(Path);
        },
		methods: {
		   verifyPermission(Path) {
                const self = this;
                      
                self.$axios.post(self.url99, {"url":Path}).then((res) => {
                    if(res.data.result=='-99' ||  res.data.result=='-999' ){
                        self.$message.error(res.data.resultMessage);
                        self.$router.push('/readme');
                        return false; 
                    }
                    
                }).catch(function(err){
                console.log("调用失败",err)
                })


            },
		}
	}
</script>