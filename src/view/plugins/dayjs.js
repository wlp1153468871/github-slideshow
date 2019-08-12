import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

/**
 * 增加 dayjs 插件, 用于相对时间计算;
 * 使用中文作为本地化语言
 */
export default function dayjsPlugin() {
  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');
}
