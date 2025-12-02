import { z } from "zod";

/**
 * Tool definitions for browser automation
 * These define the schema and structure of each tool
 */

// Navigation tools
export const NavigateTool = z.object({
  name: z.literal("browser_navigate"),
  description: z.literal("Navigate to a URL in the browser"),
  arguments: z.object({
    url: z.string().url().describe("The URL to navigate to"),
  }),
});

export const GoBackTool = z.object({
  name: z.literal("browser_go_back"),
  description: z.literal("Navigate back in the browser history"),
  arguments: z.object({}),
});

export const GoForwardTool = z.object({
  name: z.literal("browser_go_forward"),
  description: z.literal("Navigate forward in the browser history"),
  arguments: z.object({}),
});

// Interaction tools
export const ClickTool = z.object({
  name: z.literal("browser_click"),
  description: z.literal("Click on an element in the page. Use the element's reference from the page snapshot."),
  arguments: z.object({
    element: z.string().describe("Human-readable description of the element to click"),
    ref: z.string().describe("Element reference from the page snapshot"),
  }),
});

export const HoverTool = z.object({
  name: z.literal("browser_hover"),
  description: z.literal("Hover over an element in the page"),
  arguments: z.object({
    element: z.string().describe("Human-readable description of the element to hover over"),
    ref: z.string().describe("Element reference from the page snapshot"),
  }),
});

export const TypeTool = z.object({
  name: z.literal("browser_type"),
  description: z.literal("Type text into an input element"),
  arguments: z.object({
    element: z.string().describe("Human-readable description of the element to type into"),
    ref: z.string().describe("Element reference from the page snapshot"),
    text: z.string().describe("Text to type into the element"),
    submit: z.boolean().optional().describe("Whether to submit the form after typing"),
  }),
});

export const SelectOptionTool = z.object({
  name: z.literal("browser_select_option"),
  description: z.literal("Select an option in a dropdown/select element"),
  arguments: z.object({
    element: z.string().describe("Human-readable description of the select element"),
    ref: z.string().describe("Element reference from the page snapshot"),
    values: z.array(z.string()).describe("Array of option values to select"),
  }),
});

export const DragTool = z.object({
  name: z.literal("browser_drag"),
  description: z.literal("Drag an element to another element"),
  arguments: z.object({
    startElement: z.string().describe("Human-readable description of the element to drag"),
    startRef: z.string().describe("Reference of the element to drag"),
    endElement: z.string().describe("Human-readable description of the drop target"),
    endRef: z.string().describe("Reference of the drop target"),
  }),
});

// Input tools
export const PressKeyTool = z.object({
  name: z.literal("browser_press_key"),
  description: z.literal("Press a keyboard key"),
  arguments: z.object({
    key: z.string().describe("Key to press (e.g., 'Enter', 'Tab', 'Escape', 'a', 'A')"),
  }),
});

export const WaitTool = z.object({
  name: z.literal("browser_wait"),
  description: z.literal("Wait for a specified number of seconds"),
  arguments: z.object({
    time: z.number().describe("Number of seconds to wait"),
  }),
});

// Page inspection tools
export const SnapshotTool = z.object({
  name: z.literal("browser_snapshot"),
  description: z.literal("Capture a snapshot of the current page for element inspection"),
  arguments: z.object({}),
});

export const ScreenshotTool = z.object({
  name: z.literal("browser_screenshot"),
  description: z.literal("Take a screenshot of the current page"),
  arguments: z.object({}),
});

export const GetConsoleLogsTool = z.object({
  name: z.literal("browser_get_console_logs"),
  description: z.literal("Get the browser console logs"),
  arguments: z.object({}),
});
