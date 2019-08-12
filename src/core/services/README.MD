# service

这里的 service 设计参考了 angular 的 service 层的设计. 但在实践中, 我们发现 angular 的 service 层做了太多不同业务逻辑工作, 比如: 数据加载, 缓存, 格式化, 数据之间的计算. 随着项目的越来越复杂, 糅杂在一起的函数减低了代码的可维护性. 需要将 service 按照角色划分层 api, cache, format 等.

在本次重构中, 我们将 service 重新定义

1. 声明:

​    service 最好被设计为只用来调用 api. 所以如果一个 service 只包含 api 调用, 那么需要在函数注释中的`@kind`标明, 例子:

  ```javascript
  /**
   * @kind api.service
   */
  class ApprovalService {
    /** sth **/
  }
  ```

  `@kind` 目前支持3种 service 类型:

  1. api.service 类只包含了 api 调用的函数
  2. cache.service 类只包含了缓存调用的函数
  3. mix.service 包含了上述所说的2种函数