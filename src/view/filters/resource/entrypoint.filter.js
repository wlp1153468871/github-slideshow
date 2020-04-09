import { isArray, get } from 'lodash';

// If `cmd` is an array (exec form), converts it to a string for display.
const toShellForm = cmd => {
  if (isArray(cmd)) {
    return cmd.join(' ');
  }

  return cmd;
};

// Determines the container entrypoint command from the container and docker image metadata.
export default function entrypoint(container, image) {
  if (!container) {
    return null;
  }

  // http://kubernetes.io/docs/user-guide/containers/#how-docker-handles-command-and-arguments
  // eslint-disable-next-line no-shadow,one-var
  let entrypoint;
  let cmd = toShellForm(container.command);
  const args = toShellForm(container.args);

  // If `container.command` is specified,
  // use that instead of image entrypoint. Add `container.args` if present.
  if (cmd && args) {
    return `${cmd} ${args}`;
  }

  if (cmd) {
    return cmd;
  }

  if (image) {
    entrypoint = toShellForm(
      get(image, 'dockerImageMetadata.Config.Entrypoint') || ['/bin/sh', '-c'],
    );

    // If `container.args` is supplied without `container.command`,
    // use container args with the image entrypoint.
    if (args) {
      return `${entrypoint} ${args}`;
    }

    // Otherwise, use container entrypoint with container command.
    cmd = toShellForm(get(image, 'dockerImageMetadata.Config.Cmd'));
    if (cmd) {
      return `${entrypoint} ${cmd}`;
    }
  }

  if (args) {
    return `<image-entrypoint> ${args}`;
  }

  return null;
}
