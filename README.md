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

 ### 如何生成序号1,2,3 ###
 
  ```HTML
      <el-table :data="data" border style="width: 100%"  :row-class-name="tableRowClassName" ref="multipleTable"> </el-table>```
  
  
  增加 :row-class-name="tableRowClassName"，在methods里面增加index
  
  ```JavaScript:
    methods: {
           tableRowClassName(row, index) {
               //把每一行的索引放进row
               row.index = (index+1)+(this.cur_page-1)*20;
           }
         }```
  

  ### 如何查看每行的数据 即怎么传入行ID
  
  ```HTML
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
  ```
  
  路由跳转传参数在method里定义方法，传入row,其中row.id 中id是后端接口定义
  
   ```JavaScript
     handleRead(index,row){
                //this.$message('查看'+(index+1)+'行');
                this.$router.push({ path: 'productsiglelist', query: { productId: row.id }});
        },
      handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
                this.$router.push({ path: 'productupdate', query: { productId: row.id }});
      },
    ```
  ### 如何得到input值并传给后端接口
   
   ```
     平台名称：<el-input v-model="select_word"  placeholder="筛选平台" ref="flat" class="handle-input mr10"></el-input>
     产品名称：<el-input v-model="select_word0"  placeholder="筛选产品" ref="product" class="handle-input mr10"></el-input>
   ```
    增加ref,传值
    
    ```
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


