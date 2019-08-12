# view

  view 文件夹包含了所有的和视图层相关的文件, 包括组件(vue)和业务逻辑(js).

  目录结构如下:
  ```
    .
    ├── App.vue     // 整个项目的入口文件
    ├── components  // 被 pages 使用的 vue 组件
    ├── filters     // vue 的 filter
    ├── mixins      // vue 的 mixins
    ├── pages       // 每一条路由定义了一个 pages
    └── router      // vue-router 路由配置
  ```

# vue lint
  
  [vue style guide](https://vuejs.org/v2/style-guide/#Component-instance-options-order-recommended)

# notice

  我们很努力的剔除页面中的 jQuery, 一方面是结束一个时代, 一方面是 原生ES6 已经足够优秀.
