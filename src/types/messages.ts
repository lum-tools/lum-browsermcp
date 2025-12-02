/**
 * WebSocket message types for browser extension communication
 */

// Define the messages that can be sent between MCP server and browser extension
export interface SocketMessageMap {
  // Navigation
  browser_navigate: { url: string };
  browser_go_back: Record<string, never>;
  browser_go_forward: Record<string, never>;

  // Interaction
  browser_click: { element: string; ref: string };
  browser_hover: { element: string; ref: string };
  browser_type: { element: string; ref: string; text: string; submit?: boolean };
  browser_select_option: { element: string; ref: string; values: string[] };
  browser_drag: { startElement: string; startRef: string; endElement: string; endRef: string };

  // Input
  browser_press_key: { key: string };
  browser_wait: { time: number };

  // Inspection
  browser_snapshot: Record<string, never>;
  browser_screenshot: Record<string, never>;
  browser_get_console_logs: Record<string, never>;

  // Page info
  getUrl: undefined;
  getTitle: undefined;
}

export type MessageType<T> = keyof T;
export type MessagePayload<T, K extends keyof T> = T[K];
