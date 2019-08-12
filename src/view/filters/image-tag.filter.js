import parse from '@/core/lib/docker-parse-image';

export default function imageTagFilter(str) {
  return parse(str).tag;
}
