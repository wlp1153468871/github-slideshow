export default function humanizeSize(bytes) {
  if (bytes === null || bytes === undefined || bytes === '') {
    return bytes;
  }

  bytes = Number(bytes);
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  const KiB = bytes / 1024;
  if (KiB < 1024) {
    return `${KiB.toFixed(1)} KiB`;
  }

  const MiB = KiB / 1024;
  if (MiB < 1024) {
    return `${MiB.toFixed(1)} MiB`;
  }

  const GiB = MiB / 1024;
  return `${GiB.toFixed(1)} GiB`;
}
