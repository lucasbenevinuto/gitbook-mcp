import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";

export function registerContentImportTools(server: McpServer, client: GitBookClient): void {
  // ── import_content ──
  server.tool(
    "import_content",
    "Import content into a GitBook organization from a URL (DESTRUCTIVE: may overwrite existing content depending on target)",
    {
      orgId: z.string().describe("The organization ID"),
      url: z.string().describe("The URL of the content to import"),
      spaceId: z
        .string()
        .optional()
        .describe("Optional target space ID (imports into this space)"),
    },
    async ({ orgId, url, spaceId }) => {
      try {
        const data: Record<string, unknown> = { url };
        if (spaceId !== undefined) data.spaceId = spaceId;
        const result = await client.importContent(orgId, data);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
