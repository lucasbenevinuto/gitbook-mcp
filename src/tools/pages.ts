import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";
import { buildPaginationQuery } from "../utils/pagination.js";

export function registerPageTools(server: McpServer, client: GitBookClient): void {
  // ── get_space_revision ──
  server.tool(
    "get_space_revision",
    "Get the full content tree of a GitBook space (or change request)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID to read CR content instead of published"),
    },
    async ({ spaceId, changeRequestId }) => {
      try {
        const result = await client.getSpaceRevision(spaceId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_pages ──
  server.tool(
    "list_pages",
    "List all pages in a GitBook space (or change request)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, changeRequestId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listPages(spaceId, changeRequestId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_page_by_id ──
  server.tool(
    "get_page_by_id",
    "Get a specific page by its ID from a GitBook space (or change request)",
    {
      spaceId: z.string().describe("The ID of the space"),
      pageId: z.string().describe("The ID of the page"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
    },
    async ({ spaceId, pageId, changeRequestId }) => {
      try {
        const result = await client.getPageById(spaceId, pageId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_page_by_path ──
  server.tool(
    "get_page_by_path",
    "Get a specific page by its URL path from a GitBook space (or change request)",
    {
      spaceId: z.string().describe("The ID of the space"),
      pagePath: z.string().describe("The URL path of the page (e.g. 'getting-started/install')"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
    },
    async ({ spaceId, pagePath, changeRequestId }) => {
      try {
        const result = await client.getPageByPath(spaceId, pagePath, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_page_links ──
  server.tool(
    "get_page_links",
    "Get all outgoing links from a page",
    {
      spaceId: z.string().describe("The ID of the space"),
      pageId: z.string().describe("The ID of the page"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
    },
    async ({ spaceId, pageId, changeRequestId }) => {
      try {
        const result = await client.getPageLinks(spaceId, pageId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_page_backlinks ──
  server.tool(
    "get_page_backlinks",
    "Get all pages that link to a specific page (backlinks)",
    {
      spaceId: z.string().describe("The ID of the space"),
      pageId: z.string().describe("The ID of the page"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
    },
    async ({ spaceId, pageId, changeRequestId }) => {
      try {
        const result = await client.getPageBacklinks(spaceId, pageId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_files ──
  server.tool(
    "list_files",
    "List all files (images, attachments) in a GitBook space (or change request)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, changeRequestId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listFiles(spaceId, changeRequestId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_file ──
  server.tool(
    "get_file",
    "Get details and download URL for a specific file in a GitBook space",
    {
      spaceId: z.string().describe("The ID of the space"),
      fileId: z.string().describe("The ID of the file"),
      changeRequestId: z.string().optional().describe("Optional change request ID"),
    },
    async ({ spaceId, fileId, changeRequestId }) => {
      try {
        const result = await client.getFile(spaceId, fileId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
