import { io, Socket } from "socket.io-client";

const NAME_SPACE_KEYS = ["/", "messages"] as const;
type NamespaceKey = (typeof NAME_SPACE_KEYS)[number];
export type Sockets = Record<NamespaceKey, Socket>;

export const generateMultipleSocketInstances = (accessToken: string) => {
  return NAME_SPACE_KEYS.reduce((result, item) => {
    const namespaceKey: NamespaceKey = item;
    const namespaceUrl = namespaceKey === "/" ? "" : `${namespaceKey}`;
    return {
      ...result,
      [namespaceKey]: io(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${namespaceUrl}`,
        {
          auth: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      ),
    };
  }, {} as Sockets);
};
