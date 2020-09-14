import Vue from 'vue';
/**
 * @description 利用vue指令更改按钮的disable属性来节流按钮的频繁点击事件
*/
const throttleClick = Vue.directive('throttleClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 1000); // 默认时间为1秒
      }
    });
  },
});

export default { throttleClick };
