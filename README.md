# ManageSystem #

本文参考基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案。[线上地址](http://blog.gdfengshuo.com/example/work/)



## 前言 ##
 本文参考了Vue + Element组件库做了个后台管理系统，结合本公司后端Java人员提供的接口进行开发，做到从前端界面展示到后端接口的取值。在使用本框架中，遇到了很多问题，也积累了宝贵的经验。所以我就把开发这个后台管理系统的经验，上传到github上进行代码备份。


## 功能 ##
- [x] Element UI
- [x] 登录/注销
- [x] 查看平台列表 
- [x] 查看平台详情
- [x] 创建/更新 平台信息 
- [x] 保存平台信息 

以上功能均由后端接口参与


## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- src                              // 源码目录
	|   |-- components                   // 组件
	|       |-- common                   // 公共组件
	|           |-- Header.vue           // 公共头部
	|           |-- Home.vue           	 // 公共路由入口
	|           |-- Sidebar.vue          // 公共左边栏
	|		|-- project                   // 主要路由页面
	|           |-- ProductCreate.vue    // 产品页面创建
	|           |-- ProductCreate1.vue   // 产品页面创建1
	|           |-- ProductList.vue       //产品列表
	|           |-- ProductSigleList.vue  // 产品单个页面查看
	|           |-- ProductUpdate.vue     // 产品更新
	|           |-- ProductUpdate1.vue    // 产品更新页面1
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- .babelrc                         // ES6语法编译配置
	|-- .editorconfig                    // 代码编写规格
	|-- .gitignore                       // 忽略的文件
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明


## 安装步骤 ##

	git clone https://github.com/moveondo/vue-ManageSystem.git      // 把模板下载到本地
	cd vue-ManageSystem    // 进入模板目录
	npm install         // 安装项目依赖，等待安装完成之后

## 本地开发 ##

	
	npm run dev

## 构建生产 ##

	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build

## 遇到问题总结 ##

### 1,如何生成序号1,2,3 ###

 
```javascript  
        HTML: <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable"> </el-table>
   
        增加 :row-class-name="tableRowClassName"，在methods里面增加tableRowClassName
  
        tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1)+(this.cur_page-1)*20;
         }        
```
  

### 2,如何查看每行的数据 即怎么传入行ID ###
  
```javascript
  
  HTML
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
  
  
  路由跳转传参数在method里定义方法，传入row,其中row.id 中id是后端接口定义
   
     handleRead(index,row){
                //this.$message('查看'+(index+1)+'行');
                this.$router.push({ path: 'productsiglelist', query: { productId: row.id }});
        },
      handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
                this.$router.push({ path: 'productupdate', query: { productId: row.id }});
      },
```
    
### 3,如何得到input值并传给后端接口 ###
   
```javascript
   
    HTML:
    平台名称：<el-input v-model="select_word"  placeholder="筛选平台" ref="flat" class="handle-input mr10"></el-input>
    产品名称：<el-input v-model="select_word0"  placeholder="筛选产品" ref="product" class="handle-input mr10"></el-input>
   
    增加ref,传值
      
    search(){
                this.is_search = true;
                let platValue=this.$refs.flat.value;
                let productValue=this.$refs.product.value;
                this.queryData(platValue,productValue);
             },
    
        queryData(platValue,productValue){
                let self = this;
                self.$axios.post(self.url, {"platformName":platValue,"productName":productValue}).then((res) => {
                    self.tableData = res.data.content.list;
                })
            }
```
    
### 4,如何把后端数据展示出来 ?如何取前面传的值 ###
       
```javascript
      
      HTML
     <el-form-item label="平台名称">
                    <div class="">
                      {{form.platformName}}
                    </div>
                </el-form-item>
                <el-form-item label="产品名称">
                    <div class="">
                      {{form.productName}}
                    </div>
                </el-form-item>
        
        Javascript:
        初始化值为
        data: function(){
            return {
                form: {
                    platformName: '',
                    productName: '',
                    IsDisplay: '',
                    productUrl:'',
                    productPresentation:'',
                },
            }
        },
        created(){
          let Id=this.$route.query.productId;
           this.getData(Id);
        },
        methods: {
            getData(Id){
                let self = this;
                self.$axios.get("/ccdproduct/product/queryProductById.htm?productId="+Id).then((res) => {
                     let IsDisplay=res.data.content.isDisplay;

                       if(IsDisplay==true){  this.form.IsDisplay='是';}
                       else if(IsDisplay==false) { this.form.IsDisplay='否'; }

                       console.log(IsDisplay,this.form.IsDisplay);
                       this.form.platformName=res.data.content.platformName;
                       this.form.productName=res.data.content.productName;
                       this.form.productName=res.data.content.productName;
                       this.form.productUrl=res.data.content.productUrl;
                       this.form.productPresentation=res.data.content.productPresentation;
                       this.form.Id=Id;
                })
            },
```
      
### 5,option控件如何根据后端返回数据定位 ###
  
```javascript
     HTML
     <el-form-item label="筛选字段">
                      <el-select v-model="form.fields" placeholder="请选择">
                        <el-option v-for="(item, index) of fieldsValue" :label="item.lable" :value="item.value"></el-option>
                      </el-select>
      </el-form-item>
      
      javascript:
        data里面：
                fieldsValue:[
                  {
                    lable:'属性值',
                    value:'attribute_value'
                  },{
                    lable:'最大值',
                    value:'max_value'
                  },{
                    lable:'最小值',
                    value:'min_value'
                  }
                ]
          
        async created(){

          this.getDataQuery();
          let Id=this.$route.query.platformId;
          this.getDataQueryName(Id);
        },
        进行赋值， :value前面有：
          getDataQueryName(Id){
              let self = this; //
              self.$axios.get("/ccdproduct/productFiltrate/queryPlatformById.htm?productFiltrateId="+Id).then((res) => {
                  this.form.name=res.data.content.productFiltrateName;
                  this.form.client=res.data.content.display;
                  this.form.fields=res.data.content.filtrateAttributeColumn;
                  this.form.selected=res.data.content.filtrateAttributeType;
                  this.form.sort=res.data.content.filtrateType;

                  this.form.Id=Id;

              }).catch(function(err){
                 console.log("调用失败0",err)
              })
            },
```
 
### 6,后端一个接口的数据依赖另一个接口，我的做法是先取出存数组里面 ###
 
```javascript
 getDataQueryName(){
                let self = this;
                self.$axios.post(self.url0,{}).then((res) => {
                    self.Properties=res.data.content;

                    for(var i= 0,len=self.Properties.length;i<len;i++){

                      var platformId = self.Properties[i].platformId;
                      var platformName = self.Properties[i].platformName;
                    //  alert(buteName)
                       self.itemList[platformId] = platformName;
                    }

                }).catch(function(err){
                   console.log("调用失败1",err)
                })
            },  
         
 用的时候直接取：
    let platformName=this.itemList[platformId];
    
  记住data里面声明：    
       data: function(){
            return {
               itemList:Array,  
            }
        }
```
### 7,后端需要传入Json列表，如何传入? 做成数组 一次性传入 ###
```javascript
 
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
       {"attributeType":1,"attributeValue":RateA,"maxValue":RateMax,"minValue":RateMin,"isactive":true,"productId":ProductId },{"attributeType":3,"attributeValue":loanPeriodA,"maxValue":loanPeriodMax,"minValue":loanPeriodMin,"isactive":true,"productId":ProductId }, {"attributeType":2,"attributeValue":quotaA,"maxValue":quotaMax,"minValue":quotaMin,"isactive":true,"productId":ProductId },{"attributeType":4,"attributeValue":loanTimeA,"maxValue":loanTimeMax,"minValue":loanTimeMin,"isactive":true,"productId":ProductId }
     ]
          this.UpdateData(params,ProductId);
            },
            
```
 


## 其他注意事项 ##
### 一、如果我不想用到上面的某些组件呢，那我怎么在模板中删除掉不影响到其他功能呢？ ###

举个栗子，我不想用 vue-datasource 这个组件，那我需要分四步走。

第一步：删除该组件的路由，在目录 src/router/index.js 中，找到引入改组件的路由，删除下面这段代码。

```JavaScript
{
    path: '/vuetable',
    component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
},
```

第二步：删除引入该组件的文件。在目录 src/components/page/ 删除 VueTable.vue 文件。

第三步：删除该页面的入口。在目录 src/components/common/Sidebar.vue 中，找到该入口，删除下面这段代码。
	
```HTML
<el-menu-item index="vuetable">Vue表格组件</el-menu-item>
```

第四步：卸载该组件。执行以下命令：
	
	npm un vue-datasource -S

完成。

### 二、如何切换主题色呢？ ###

第一步：打开 src/main.js 文件，找到引入 element 样式的地方，换成浅绿色主题。

```javascript
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
```

第二步：打开 src/App.vue 文件，找到 style 标签引入样式的地方，切换成浅绿色主题。

```javascript
@import "../static/css/main.css";
@import "../static/css/color-dark.css";     /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/
```

第三步：打开 src/components/common/Sidebar.vue 文件，找到 el-menu 标签，把 theme="dark" 去掉即可。

## 项目截图 ##
### 项目生成截图 ###

![Image text](https://github.com/moveondo/vue-ManageSystem/blob/master/static/img/like.png)

### 项目代码截图 ###

![Image text](https://github.com/moveondo/vue-ManageSystem/blob/master/static/img/project.png)


