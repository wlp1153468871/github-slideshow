
export default function scanOverviewStatus(scan_overview) {
  if (!scan_overview) return 'unScan';
  if (scan_overview.scan_status === 'pending') {
    return 'pending';
  }
  let status;
  if (scan_overview.severity === 5) {
    status = 'maxSeverity';
  }
  if (scan_overview.severity === 4) {
    status = 'middleSeverity';
  }
  if (scan_overview.severity === 3) {
    status = 'lowSeverity';
  }
  if (scan_overview.severity === 2) {
    status = 'unKnowSeverity';
  }
  if (scan_overview.severity === 1) {
    status = 'noSeverity';
  }
  return status;
}
