import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";

export function registerGitSyncTools(server: McpServer, client: GitBookClient): void {
  // ── git_import ──
  server.tool(
    "git_import",
    "Import content from a Git repository into a GitBook space (DESTRUCTIVE: overwrites existing content)",
    {
      spaceId: z.string().describe("The ID of the space to import into"),
      url: z.string().describe("The Git repository URL to import from"),
    },
    async ({ spaceId, url }) => {
      try {
        const result = await client.gitImport(spaceId, { url });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── git_export ──
  server.tool(
    "git_export",
    "Export GitBook space content to a Git repository",
    {
      spaceId: z.string().describe("The ID of the space to export from"),
      url: z.string().describe("The Git repository URL to export to"),
    },
    async ({ spaceId, url }) => {
      try {
        const result = await client.gitExport(spaceId, { url });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_git_info ──
  server.tool(
    "get_git_info",
    "Get Git sync configuration and status for a GitBook space",
    {
      spaceId: z.string().describe("The ID of the space"),
    },
    async ({ spaceId }) => {
      try {
        const info = await client.getGitInfo(spaceId);
        return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
