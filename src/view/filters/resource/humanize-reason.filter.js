import { startCase } from 'lodash';

export default function humanizeReason(reason) {
  const humanizedReason = startCase(reason);
  // Special case some values like "BackOff" -> "Back-off"
  return humanizedReason
    .replace('Back Off', 'Back-off')
    .replace('O Auth', 'OAuth');
}
