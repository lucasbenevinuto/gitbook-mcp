import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";
import { buildPaginationQuery } from "../utils/pagination.js";

export function registerChangeRequestTools(server: McpServer, client: GitBookClient): void {
  // ── create_change_request ──
  server.tool(
    "create_change_request",
    "Create a new change request (similar to a PR/draft) in a GitBook space",
    {
      spaceId: z.string().describe("The ID of the space"),
      subject: z.string().optional().describe("Subject/title of the change request"),
    },
    async ({ spaceId, subject }) => {
      try {
        const data: { subject?: string } = {};
        if (subject !== undefined) data.subject = subject;
        const cr = await client.createChangeRequest(spaceId, data);
        return { content: [{ type: "text", text: JSON.stringify(cr, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_change_requests ──
  server.tool(
    "list_change_requests",
    "List change requests in a GitBook space",
    {
      spaceId: z.string().describe("The ID of the space"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listChangeRequests(spaceId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_change_request ──
  server.tool(
    "get_change_request",
    "Get details of a specific change request",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
    },
    async ({ spaceId, changeRequestId }) => {
      try {
        const cr = await client.getChangeRequest(spaceId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(cr, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── update_change_request ──
  server.tool(
    "update_change_request",
    "Update a change request's properties (subject, status, etc.)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
      subject: z.string().optional().describe("New subject/title"),
      status: z
        .enum(["draft", "open", "closed"])
        .optional()
        .describe("New status for the change request"),
    },
    async ({ spaceId, changeRequestId, subject, status }) => {
      try {
        const data: Record<string, unknown> = {};
        if (subject !== undefined) data.subject = subject;
        if (status !== undefined) data.status = status;
        const cr = await client.updateChangeRequest(spaceId, changeRequestId, data);
        return { content: [{ type: "text", text: JSON.stringify(cr, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── merge_change_request ──
  server.tool(
    "merge_change_request",
    "Merge a change request into the main content (DESTRUCTIVE: publishes changes)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request to merge"),
    },
    async ({ spaceId, changeRequestId }) => {
      try {
        const result = await client.mergeChangeRequest(spaceId, changeRequestId);
        return {
          content: [
            {
              type: "text",
              text: `Change request ${changeRequestId} merged successfully.\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── sync_change_request ──
  server.tool(
    "sync_change_request",
    "Sync/update a change request with the latest main content",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request to sync"),
    },
    async ({ spaceId, changeRequestId }) => {
      try {
        const result = await client.syncChangeRequest(spaceId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
