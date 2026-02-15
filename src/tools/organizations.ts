import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";
import { buildPaginationQuery } from "../utils/pagination.js";

export function registerOrganizationTools(server: McpServer, client: GitBookClient): void {
  // ── get_organization ──
  server.tool(
    "get_organization",
    "Get details of a GitBook organization",
    {
      orgId: z.string().describe("The organization ID"),
    },
    async ({ orgId }) => {
      try {
        const org = await client.getOrganization(orgId);
        return { content: [{ type: "text", text: JSON.stringify(org, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_collections ──
  server.tool(
    "list_collections",
    "List all collections in a GitBook organization",
    {
      orgId: z.string().describe("The organization ID"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ orgId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listCollections(orgId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── get_collection ──
  server.tool(
    "get_collection",
    "Get details of a specific collection in a GitBook organization",
    {
      orgId: z.string().describe("The organization ID"),
      collectionId: z.string().describe("The collection ID"),
    },
    async ({ orgId, collectionId }) => {
      try {
        const collection = await client.getCollection(orgId, collectionId);
        return { content: [{ type: "text", text: JSON.stringify(collection, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── ask_ai ──
  server.tool(
    "ask_ai",
    "Ask GitBook AI a question about the organization's documentation content",
    {
      orgId: z.string().describe("The organization ID"),
      query: z.string().describe("The question to ask the AI"),
    },
    async ({ orgId, query }) => {
      try {
        const response = await client.askAI(orgId, { query });
        return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
