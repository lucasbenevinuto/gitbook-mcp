import { z } from "zod";

// Common parameter schemas reused across tools

export const spaceIdSchema = z.string().describe("The ID of the GitBook space");

export const orgIdSchema = z.string().describe("The ID of the GitBook organization");

export const changeRequestIdSchema = z
  .string()
  .describe("The ID or number of the change request");

export const pageIdSchema = z.string().describe("The ID of the page");

export const commentIdSchema = z.string().describe("The ID of the comment");

export const fileIdSchema = z.string().describe("The ID of the file");

export const collectionIdSchema = z.string().describe("The ID of the collection");

export const paginationSchema = z.object({
  page: z.string().optional().describe("Pagination token for the next page"),
  limit: z.number().optional().describe("Maximum number of items to return"),
});

export const optionalChangeRequestSchema = z
  .string()
  .optional()
  .describe(
    "Optional change request ID/number. When provided, reads content from the CR instead of the published version"
  );

// Review schemas
export const reviewStatusSchema = z
  .enum(["approved", "changes-requested", "commented"])
  .describe("The review decision");

// Comment schemas
export const commentBodySchema = z.object({
  body: z.string().describe("The comment text content (markdown supported)"),
});

// Git sync schemas
export const gitUrlSchema = z.string().url().describe("The Git repository URL");

// Content import schemas
export const importUrlSchema = z.string().url().describe("URL of the content to import");
