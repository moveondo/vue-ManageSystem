<template lang="html">
  <div class="">

  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  created() {
    let self=this;
    self.back();

  },
  methods: {
    back(){

      let isiOS = navigator.userAgent.match('iPad')
                 || navigator.userAgent.match('iPhone')
                 || navigator.userAgent.match('iPod');
      if(isiOS){
        window.webkit.messageHandlers.close.postMessage({title:'WKWebView', message:'测试WKWebView和OC交互'});
      }else{
        window.JSHandle.close();
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
