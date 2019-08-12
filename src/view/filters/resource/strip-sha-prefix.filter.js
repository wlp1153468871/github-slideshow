// Remove "sha256:" from the start of an identifier if present.
export default function stripShaPrefix(id) {
  if (!id) {
    return id;
  }

  return id.replace(/^sha256:/, '');
}
