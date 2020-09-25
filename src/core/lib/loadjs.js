// 动态加载js文件

export default function loadJS(url, id, callback) {
  const script = document.createElement('script');
  // eslint-disable-next-line func-names
  const fn = callback || function () {};
  script.type = 'text/javascript';
  script.id = id || 'dx-no-file';
  script.async = true;

  // IE
  if (script.readyState) {
    script.onreadystatechange = () => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    // 其他浏览器
    script.onload = () => {
      fn();
    };
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
