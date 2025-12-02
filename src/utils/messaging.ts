import type { WebSocket } from "ws";
import type { MessagePayload, MessageType, SocketMessageMap } from "@/types/messages";

/**
 * Create a socket message sender for communicating with the browser extension
 */
export function createSocketMessageSender<T extends SocketMessageMap>(ws: WebSocket) {
  let messageId = 0;

  async function sendSocketMessage<K extends MessageType<T>>(
    type: K,
    payload: MessagePayload<T, K>,
    options: { timeoutMs?: number } = { timeoutMs: 30000 }
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++messageId;
      const timeoutMs = options.timeoutMs ?? 30000;

      const timeout = setTimeout(() => {
        ws.removeListener("message", handleMessage);
        reject(new Error(`Message timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      function handleMessage(data: Buffer | ArrayBuffer | Buffer[]) {
        try {
          const message = JSON.parse(data.toString());
          if (message.id === id) {
            clearTimeout(timeout);
            ws.removeListener("message", handleMessage);
            
            if (message.error) {
              reject(new Error(message.error));
            } else {
              resolve(message.result);
            }
          }
        } catch {
          // Ignore parse errors for other messages
        }
      }

      ws.on("message", handleMessage);

      ws.send(
        JSON.stringify({
          id,
          type,
          payload,
        })
      );
    });
  }

  return { sendSocketMessage };
}
