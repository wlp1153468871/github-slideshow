import humanizeReason from '@/view/filters/resource/humanize-reason.filter';

export default function humanizePodStatus(reason) {
  return humanizeReason(reason);
}
