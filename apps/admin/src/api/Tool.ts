import type { ConnectionTemplateData, ServiceTemplateData } from '../interface';

// Pure lookups over the catalog type registry. These must NOT call hooks:
// they are invoked inside `.map()`/JSX render (e.g. GroupDetail lists), so a
// hook here would violate the rules of hooks ("rendered more hooks than during
// the previous render" once a list grows). Callers read the arrays once via
// useTemplate() at component top and pass them in.
export function findServiceType(
  services: ServiceTemplateData[] | undefined,
  serviceType: string,
): ServiceTemplateData | undefined {
  return services?.find((item) => item.type === serviceType);
}

export function findConnectionType(
  connections: ConnectionTemplateData[] | undefined,
  connectionType: string,
): ConnectionTemplateData | undefined {
  return connections?.find((item) => item.type === connectionType);
}
