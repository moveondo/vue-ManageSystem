import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                //平台页面
                {
                    path: '/tablelist',
                    component: resolve => require(['../components/project/TableList.vue'], resolve)
                },
                {
                    path: '/tablecreate',
                    component: resolve => require(['../components/project/TableCreate.vue'], resolve)
                },
                {
                    path: '/tablesiglelist',
                    component: resolve => require(['../components/project/TableSigleList.vue'], resolve)
                },
                {
                    path: '/tableupdate',
                    component: resolve => require(['../components/project/TableUpdate.vue'], resolve)
                },
                  //筛选页面
                {
                    path: '/filterlist',
                    component: resolve => require(['../components/project/FilterList.vue'], resolve)
                },
                {
                    path: '/filtercreate',
                    component: resolve => require(['../components/project/FilterCreate.vue'], resolve)
                },
                {
                    path: '/filtersiglelist',
                    component: resolve => require(['../components/project/FilterSigleList.vue'], resolve)
                },
                {
                    path: '/filterupdate',
                    component: resolve => require(['../components/project/FilterUpdate.vue'], resolve)
                },
                //产品页面
              {
                  path: '/productlist',
                  component: resolve => require(['../components/project/ProductList.vue'], resolve)
              },
              {
                  path: '/productcreate',
                  component: resolve => require(['../components/project/ProductCreate.vue'], resolve)
              },
              {
                  path: '/productcreate1',
                  component: resolve => require(['../components/project/ProductCreate1.vue'], resolve)
              },
              {
                  path: '/productsiglelist',
                  component: resolve => require(['../components/project/ProductSigleList.vue'], resolve)
              },
              {
                  path: '/productupdate',
                  component: resolve => require(['../components/project/ProductUpdate.vue'], resolve)
              },
              {
                  path: '/productupdate1',
                  component: resolve => require(['../components/project/ProductUpdate1.vue'], resolve)
              }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
