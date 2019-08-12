import img403 from '@/assets/images/403.png';
import img404 from '@/assets/images/404.png';
import img500 from '@/assets/images/500.png';

const types = {
  403: {
    img: img403,
    title: '403',
    desc: '抱歉，你无权访问该页面',
  },
  40301: {
    img: img403,
    title: '403',
    desc: '抱歉，你暂未加入任何项目组，请联系管理员。',
  },
  404: {
    img: img404,
    title: '404',
    desc: '抱歉，你访问的页面不存在或仍在开发中',
  },
  500: {
    img: img500,
    title: '500',
    desc: '抱歉，服务器出错了',
  },
};

export default types;
