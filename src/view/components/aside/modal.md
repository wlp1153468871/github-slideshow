### API

| 成员              | 说明                                                   | 类型     | 默认值 |
| ----------------- | ------------------------------------------------------ | -------- | ------ |
| is-show           | modal 是否显示                                         | Boolean  | false  |
| title             | 标题                                                   | String   | 无     |
| ok-text           | 确定按钮的文字                                         | String   | OK     |
| cancel-text       | 取消按钮的文字                                         | String   | Cancel |
| on-ok             | 点击 ok 后的回调                                       | Function | 无     |
| on-cancel         | 点击 cancel 后的回调                                   | Function | 无     |
| backdrop          | 是否显示遮罩层                                         | Boolean  | true   |
| backdrop-closable | 遮罩层是否可关闭 modal                                 | Boolean  | true   |
| okLoading         | 确定按钮 loading（开启后点击 ok 将不会自动关闭 modal） | Boolean  | false  |
| width             | modal 的宽度                                           | Number   | 640    |
| transition        | 过渡效果,可选值见 #link                                | String   | fade   |
| show-header       | 是否显示头部                                           | Boolean  | true   |
| show-footer       | 是否显示尾部                                           | Boolean  | true   |
| show-ok           | 是否显示 ok 按钮                                       | Boolean  | true   |
| show-cancel       | 是否显示 cancel 按钮                                   | Boolean  | true   |

| 成员      | 说明 | 类型   | 默认值 |
| --------- | ---- | ------ | ------ |
| placement | 位置 | String | left   |
| width     | 宽度 | Number | 400    |
