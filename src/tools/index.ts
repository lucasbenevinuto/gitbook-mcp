import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GitBookClient } from "../client/gitbook-client.js";
import { registerSpaceTools } from "./spaces.js";
import { registerPageTools } from "./pages.js";
import { registerChangeRequestTools } from "./change-requests.js";
import { registerReviewTools } from "./reviews.js";
import { registerCommentTools } from "./comments.js";
import { registerGitSyncTools } from "./git-sync.js";
import { registerOrganizationTools } from "./organizations.js";
import { registerContentImportTools } from "./content-import.js";

export function registerAllTools(server: McpServer, client: GitBookClient): void {
  registerSpaceTools(server, client);          // 6 tools
  registerPageTools(server, client);           // 8 tools
  registerChangeRequestTools(server, client);  // 6 tools
  registerReviewTools(server, client);         // 5 tools
  registerCommentTools(server, client);        // 6 tools
  registerGitSyncTools(server, client);        // 3 tools
  registerOrganizationTools(server, client);   // 4 tools
  registerContentImportTools(server, client);  // 1 tool  = 39 total
}
