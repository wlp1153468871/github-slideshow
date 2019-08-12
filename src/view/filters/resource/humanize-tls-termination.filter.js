export default function humanizeTLSTerminationFilter(termination) {
  switch (termination) {
    case 'edge':
      return 'Edge';
    case 'passthrough':
      return 'Passthrough';
    case 'reencrypt':
      return 'Re-encrypt';
    default:
      return termination;
  }
}
