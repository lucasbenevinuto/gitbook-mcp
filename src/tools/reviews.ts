import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitBookClient } from "../client/gitbook-client.js";
import { formatToolError } from "../utils/errors.js";
import { buildPaginationQuery } from "../utils/pagination.js";

export function registerReviewTools(server: McpServer, client: GitBookClient): void {
  // ── list_reviews ──
  server.tool(
    "list_reviews",
    "List reviews on a change request",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
      page: z.string().optional().describe("Pagination token"),
      limit: z.number().optional().describe("Max items to return"),
    },
    async ({ spaceId, changeRequestId, page, limit }) => {
      try {
        const query = buildPaginationQuery({ page, limit });
        const result = await client.listReviews(spaceId, changeRequestId, query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── submit_review ──
  server.tool(
    "submit_review",
    "Submit a review on a change request (approve, request changes, or comment)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
      status: z
        .enum(["approved", "changes-requested", "commented"])
        .describe("The review decision"),
      comment: z.string().optional().describe("Optional review comment"),
    },
    async ({ spaceId, changeRequestId, status, comment }) => {
      try {
        const data: { status: string; comment?: string } = { status };
        if (comment !== undefined) data.comment = comment;
        const review = await client.submitReview(spaceId, changeRequestId, data);
        return { content: [{ type: "text", text: JSON.stringify(review, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── list_requested_reviewers ──
  server.tool(
    "list_requested_reviewers",
    "List users who have been requested to review a change request",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
    },
    async ({ spaceId, changeRequestId }) => {
      try {
        const reviewers = await client.listRequestedReviewers(spaceId, changeRequestId);
        return { content: [{ type: "text", text: JSON.stringify(reviewers, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── request_reviewers ──
  server.tool(
    "request_reviewers",
    "Request specific users to review a change request",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
      userIds: z.array(z.string()).describe("Array of user IDs to request as reviewers"),
    },
    async ({ spaceId, changeRequestId, userIds }) => {
      try {
        const result = await client.requestReviewers(spaceId, changeRequestId, userIds);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );

  // ── remove_reviewer ──
  server.tool(
    "remove_reviewer",
    "Remove a requested reviewer from a change request (DESTRUCTIVE)",
    {
      spaceId: z.string().describe("The ID of the space"),
      changeRequestId: z.string().describe("The ID or number of the change request"),
      userId: z.string().describe("The user ID to remove from reviewers"),
    },
    async ({ spaceId, changeRequestId, userId }) => {
      try {
        await client.removeReviewer(spaceId, changeRequestId, userId);
        return {
          content: [
            { type: "text", text: `Reviewer ${userId} removed from change request ${changeRequestId}.` },
          ],
        };
      } catch (error) {
        return { content: [{ type: "text", text: formatToolError(error) }], isError: true };
      }
    }
  );
}
