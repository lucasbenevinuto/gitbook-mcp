import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";
import { buildPaginationQuery } from "../utils/pagination.js";

export function registerCommentTools(server: McpServer, client: GitBookClient): void {
  // ── list_comments ──
  server.tool(
    "list_comments",
    "List comments on a GitBook space or change request",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID (scopes comments to that CR)"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, changeRequestId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listComments(spaceId, changeRequestId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── post_comment ──
  server.tool(
    "post_comment",
    "Post a new comment on a GitBook space or change request",
    {
      spaceId: z.string().describe("The ID of the space"),
      body: z.string().describe("The comment text (markdown supported)"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID (posts comment on that CR)"),
    },
    async ({ spaceId, body, changeRequestId }) => {
      try {
        const comment = await client.postComment(spaceId, { body }, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(comment, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── update_comment ──
  server.tool(
    "update_comment",
    "Update an existing comment (uses PUT as per GitBook API)",
    {
      spaceId: z.string().describe("The ID of the space"),
      commentId: z.string().describe("The ID of the comment to update"),
      body: z.string().describe("The new comment text (markdown supported)"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID if comment is on a CR"),
    },
    async ({ spaceId, commentId, body, changeRequestId }) => {
      try {
        const comment = await client.updateComment(spaceId, commentId, { body }, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(comment, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── delete_comment ──
  server.tool(
    "delete_comment",
    "Delete a comment (DESTRUCTIVE: cannot be undone)",
    {
      spaceId: z.string().describe("The ID of the space"),
      commentId: z.string().describe("The ID of the comment to delete"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID if comment is on a CR"),
    },
    async ({ spaceId, commentId, changeRequestId }) => {
      try {
        await client.deleteComment(spaceId, commentId, changeRequestId);
        return {
          content: [{ type: "text", text: `Comment ${commentId} deleted successfully.` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_comment_replies ──
  server.tool(
    "list_comment_replies",
    "List replies to a specific comment",
    {
      spaceId: z.string().describe("The ID of the space"),
      commentId: z.string().describe("The ID of the parent comment"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID if comment is on a CR"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, commentId, changeRequestId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listCommentReplies(
          spaceId,
          commentId,
          changeRequestId,
          query
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── post_comment_reply ──
  server.tool(
    "post_comment_reply",
    "Post a reply to an existing comment",
    {
      spaceId: z.string().describe("The ID of the space"),
      commentId: z.string().describe("The ID of the parent comment to reply to"),
      body: z.string().describe("The reply text (markdown supported)"),
      changeRequestId: z
        .string()
        .optional()
        .describe("Optional change request ID if comment is on a CR"),
    },
    async ({ spaceId, commentId, body, changeRequestId }) => {
      try {
        const reply = await client.postCommentReply(
          spaceId,
          commentId,
          { body },
          changeRequestId
        );
        return { content: [{ type: "text", text: JSON.stringify(reply, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
