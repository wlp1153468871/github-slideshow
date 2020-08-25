## 项目笔记

### package
1. browserslist 项目兼容的浏览器平台
  可见.browserslistrc文件，规定了各浏览器的版本


### VueCli
1. pages 入口文件，有一个entry必选，其他的templae，filename等可选
2. 


### 开发笔记
1. inline-block是有一个小坑的，UI如果是刚好卡住布满页面，而使用了inline-block是会有一个很小的边距的，本来使用inline-block会刚好并列布局，但是因为这个小bug，多出了一点边距，导致他不能并列，到第二列去了，可以使用float的布局，或者overflow: hidden来清除浮动，脱离文档流。
2. UI图纸要按照图纸比例来进行开发，如果比例不满足就需要按比例或者另想办法解决了。
3. 媒体查询
4. DOM要看渲染的位置，需要宽高布局都有长度，会存在定位问题


### 项目问题
