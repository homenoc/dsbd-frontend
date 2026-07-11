import { useTemplate } from '../hooks/useTemplate';
import type { ConnectionTemplateData, ServiceTemplateData } from '../interface';

export function GetServiceWithTemplate(serviceType: string): ServiceTemplateData | undefined {
  const { data: template } = useTemplate();

  const serviceTemplate = template.services?.find((item) => item.type === serviceType);
  if (serviceTemplate == null) {
    return undefined;
  }

  return serviceTemplate;
}

export function GetConnectionWithTemplate(
  connectionType: string,
): ConnectionTemplateData | undefined {
  const { data: template } = useTemplate();

  const connectionTemplate = template.connections?.find((item) => item.type === connectionType);
  if (connectionTemplate == null) {
    return undefined;
  }

  return connectionTemplate;
}
