import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";
import { buildPaginationQuery } from "../utils/pagination.js";

export function registerSpaceTools(server: McpServer, client: GitBookClient): void {
  // ── get_space ──
  server.tool(
    "get_space",
    "Get details of a GitBook space by its ID",
    { spaceId: z.string().describe("The ID of the GitBook space") },
    async ({ spaceId }) => {
      try {
        const space = await client.getSpace(spaceId);
        return { content: [{ type: "text", text: JSON.stringify(space, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── update_space ──
  server.tool(
    "update_space",
    "Update a GitBook space's properties (title, visibility, etc.)",
    {
      spaceId: z.string().describe("The ID of the space to update"),
      title: z.string().optional().describe("New title for the space"),
      visibility: z
        .enum(["public", "unlisted", "share-link", "visitor-auth", "in-collection"])
        .optional()
        .describe("Visibility setting for the space"),
    },
    async ({ spaceId, title, visibility }) => {
      try {
        const data: Record<string, unknown> = {};
        if (title !== undefined) data.title = title;
        if (visibility !== undefined) data.visibility = visibility;
        const space = await client.updateSpace(spaceId, data);
        return { content: [{ type: "text", text: JSON.stringify(space, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── create_space ──
  server.tool(
    "create_space",
    "Create a new GitBook space in an organization",
    {
      orgId: z.string().describe("The organization ID"),
      title: z.string().describe("Title for the new space"),
      visibility: z
        .enum(["public", "unlisted", "share-link", "visitor-auth", "in-collection"])
        .optional()
        .describe("Visibility setting (defaults to organization default)"),
    },
    async ({ orgId, title, visibility }) => {
      try {
        const data: Record<string, unknown> = { title };
        if (visibility !== undefined) data.visibility = visibility;
        const space = await client.createSpace(orgId, data);
        return { content: [{ type: "text", text: JSON.stringify(space, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── duplicate_space ──
  server.tool(
    "duplicate_space",
    "Duplicate an existing GitBook space (creates a full copy)",
    { spaceId: z.string().describe("The ID of the space to duplicate") },
    async ({ spaceId }) => {
      try {
        const space = await client.duplicateSpace(spaceId);
        return { content: [{ type: "text", text: JSON.stringify(space, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_spaces ──
  server.tool(
    "list_spaces",
    "List all spaces in a GitBook organization",
    {
      orgId: z.string().describe("The organization ID"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ orgId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listSpaces(orgId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── search_space_content ──
  server.tool(
    "search_space_content",
    "Search for content within a GitBook space",
    {
      spaceId: z.string().describe("The ID of the space to search in"),
      query: z.string().describe("The search query"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, query, page, limit }) => {
      try {
        const params = buildPaginationQuery({ page, limit });
        const result = await client.searchSpaceContent(spaceId, query, params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
